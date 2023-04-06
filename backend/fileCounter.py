import os
import math
import sys
import csv
def main():
    repoDir = sys.argv[1];
    clocOut = countLines(repoDir)
    correctness = calcCorrectness(clocOut)
    rampUp = calcRampUp(clocOut[0], clocOut[1], clocOut[3])
    writeToFile('info.tmp', str(rampUp), str(correctness))

#Calculates the correctness score using the cloco data produced from countLines
def calcCorrectness(clocOut):
    diff = clocOut[1] - clocOut[3]
    diff = 1 if diff == 0 else diff
    correctness = clocOut[3] / diff * 0.6 + clocOut[3] * .001
    correctness  = 1 if correctness > 1 else correctness
    return(correctness)

#Counts the number of lines of code and returns an output in the form [numDocLines, numCodeLines, totalNumLines, numTestLines]
def countLines(repoDir):
    createClocFile(repoDir, 'clocOutput')
    clocOut = readClocFile('clocOutput')
    findTestDirs(repoDir)
    numTestLines = countLinesTest('testList', repoDir)
    clocOut.append(numTestLines)
    return(clocOut)
#Runs the installed cloc commands and creates a file containing a csv version of the data. The first line contians all code
#The second line contains specifically documentation related files
def createClocFile(repoDir, outputFile):

    clocLoc = 'cloc/cloc'
    cmd = clocLoc + ' --csv ' + repoDir + '| tail -n 1 > ' + outputFile
    os.system(cmd)
    cmd = clocLoc + ' --csv --include-lang=Markdown,Text,TeX ' + repoDir + ' | tail -n 1 >> ' + outputFile
    os.system(cmd)

#Reads the outputted cloc file and calculates numComments, numCodeLines and numTotalLines
def readClocFile(inputFile):
    numComments = 0
    numCodeLines = 0
    numTotalLines = 0
    line_count = 0
    with open(inputFile) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            if line_count == 0:
                numComments = int(row[3])
                numCodeLines = int(row[4])
                line_count+= 1
            else:
                numComments += int(row[4])
                numCodeLines -= int(row[4])
                numTotalLines = numComments + numCodeLines
    return([numComments, numCodeLines, numTotalLines])


#Calculates the ramp up score using the following formula: tanh(3* (docLine/(codeLines - testLines)) / (log_100(codeLines - testLines)))
def calcRampUp(docLines, codeLines, testLines):
    adjLines = codeLines - testLines
    adjLines = adjLines if adjLines >= 0 else 1
    ratio = docLines/adjLines
    rampUp = math.tanh(3 * ratio / (math.log(codeLines - testLines, 100)))
    return(rampUp)
#Writes relevant data to the info file to be accessed later and by other programs
def writeToFile(fileName, rampUp, correctness):
    file = open(fileName, 'w')
    file.write(rampUp + "\n")
    file.write(correctness + "\n")
    file.close()


#Creates a file containing all possible test files of a given repo
def findTestDirs(repoDir):
    cmd1 = "ls " + repoDir + " | grep test > testList"
    cmd2 = "ls " + repoDir + " | grep Test >> testList"
    os.system(cmd1)
    os.system(cmd2)

#Loops through the given file to count lines of test code
def countLinesTest(testFile, repoDir):
    file = open(testFile, 'r')
    testDirs = file.read().splitlines()
    for testDir in testDirs:
        fullDir = repoDir + '/' + testDir
        #print(fullDir)
        cmd = 'cloc/cloc --csv ' + fullDir + ' | tail -n 1 >> numTestLines'
        #print(cmd)
        os.system(cmd)
    lineCount = 0
    with open("./numTestLines") as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=",")
        for row in csv_reader:
            lineCount+= int(row[4])
    os.system("rm ./numTestLines")
    os.system("rm ./testList")
    return(lineCount);
if __name__ == "__main__":
    main()
