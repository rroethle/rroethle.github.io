import sys
import json
import os

path = os.path.dirname(os.path.abspath(__file__))

try:
    print "generating blog..."

    #read in template information
    index = open(os.path.join(path, 'index.dcc'), 'r').read()
    entryStyle = open(os.path.join(path, 'entry_style.dcc'), 'r').read()

    #read in blog entries from json file
    with open(os.path.join(path, 'entries.json'),'r') as data_file:    
        entries = json.load(data_file)

    #style blog entries
    styledEntries=""
    for entry in entries["entries"]:
        styledEntries=styledEntries+'\n'+entryStyle.format(entry["date"],entry["title"],entry["text"])

    #add format wrapping
    index = index.format(styledEntries)

    #write all entries into index
    index_file = open(os.path.join(path, 'blog.html'), "w")
    index_file.write(index)
    index_file.close()

except Exception,e:
    print str(sys.exc_traceback.tb_lineno) +":"+str(e)

print "done."