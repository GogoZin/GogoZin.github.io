import os

open_file = open("539.txt").readlines()
f = open("539.txt","w")
for lines in open_file:
    if len(lines)<9:
        pass
    else:
        f.write(lines)
f.close()