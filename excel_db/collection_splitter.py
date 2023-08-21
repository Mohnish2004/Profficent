from pydoc import splitdoc
from pymongo import MongoClient
import pprint as pp
import pickle
import sys
import db_utils

options = {
    'client_db'          : "schedule-tool",
    'src_db_name'        : "schedule-tool",
    #'dest_db_name'       : "robert-test",
    'dest_db_name'       : "robert-test",
    'src_collection'     : "enrollment",
    'collection_1' : {
        'name' : 'enrollment_info',
        'fields' : ["name", "course_id", "crn", "instructor", "quarter", "ge_list", "units",  "description", "final_exam", "prereq"]
    },
    'collection_2' : {
        'name' : 'enrollment_stats',
        'fields' : ["seats", "max_seats"]
    },
}

class SplitCollections:
    def __init__(self, src_collection, new_collections, src, dest, connectionToClient):
        self.src = src
        self.new_collections = new_collections
        self.src_collection = src_collection
        self.dest = dest
        self.new_collections = new_collections

        self.src_db = connectionToClient[self.src]
        self.dest_db = connectionToClient[self.dest]
        
        old_collection = self.src_db[self.src_collection]
        print("Reading from database")
        documents = old_collection.find({})
        self.collection1_docs = []
        self.collection2_docs = []
        # within in old collection, filter out the fields for collection_1 and collection_2
        for d in documents:
            new_doc = {}
            for field in new_collections[0]['fields']:
                new_doc.update({field : d[field]})
            self.collection1_docs.append(new_doc)
            # new_doc = {}
            # for field in new_collections[1]['fields']:
            #     new_doc.update({field : d[field]})
            # self.collection2_docs.append(new_doc)
        # print(type(self.collection1_docs[1]))

    def load_collections(self):
        # self.clear_dest_collections()
        print("Inserting split collection " + self.new_collections[0]['name'] + " in " + self.dest)
        upload_collection = self.dest_db[self.new_collections[0]['name']]
        upload_collection.insert_many(self.collection1_docs)

        # print("Inserting split collection " + self.new_collections[1]['name'] + " in " + self.dest)
        # upload_collection = self.dest_db[self.new_collections[1]['name']]
        # upload_collection.insert_many(self.collection2_docs)
        # for d in self.collection2_docs:
        #     upload_collection.insert_one(d)

    def save_local(self):
        print("Writing pickle file " + self.new_collections[0]['name'])
        c1_db_file_handle = open(self.new_collections[0]['name'] + ".db", "wb")
        pickle.dump(self.collection1_docs, c1_db_file_handle)
        c1_db_file_handle.close()

        # print("Writing pickle file " + self.new_collections[1]['name'])
        # c2_db_file_handle = open(self.new_collections[1]['name']+ ".db", "wb")
        # pickle.dump(self.collection2_docs, c2_db_file_handle)
        # c2_db_file_handle.close()

# if __name__ == "__main__":
#     src_collection = options['src_collection']
#     new_collections = [options['collection_1'], options['collection_2']]
#     src_db = options['src_db_name']
#     dest_db = options['dest_db_name']
#     client = options['client_db']
#     splitDb = SplitCollections(src_collection, new_collections, client, src_db, dest_db)
#     # splitDb.save_local()
#     splitDb.load_collections()


    
