from pymongo import MongoClient
from collection_splitter import SplitCollections
import pprint as pp
import pickle
import sys



options = {
    'src_db' : "standardized-course-id", 
    'src_collection' : "details", 
    'dest_db' : "myFirstDatabase", 
    'dest_collection' : "course_details",
    'collection_1' : {
        'name' : 'course_details',
        'fields' : ["name", "crn", "subj", "code", "course_id", "instructor", "quarter"]
    }
}

# mongodb+srv://lunchroom_admin:$$Lunchr33m@cluster0.u1fmi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

class UpdateDatabaseCollections:
    def __init__(self):
        self.src_db = options['src_db']
        self.src_collection = options['src_collection']
        
        self.dest_db = options['dest_db']
        self.dest_collection = options['dest_collection']

        # print("Connecting to Mongo DB")
        # # connect to client
        client_name = "mongodb+srv://lunchroom_admin:$$Lunchr33m@cluster0.u1fmi.mongodb.net/" + self.src_db + "?retryWrites=true&w=majority"
        dest_name = "mongodb+srv://lunchroom_admin:$$Lunchr33m@cluster0.u1fmi.mongodb.net/" + self.dest_db + "?retryWrites=true&w=majority"
        # # print(client_name)
        try:
            self.client = MongoClient(client_name)
            print("Connected to client successfully")
        except:
            print("ERR: Unable to open client")
            sys.exit()

        # try to connect to database
        print("Validating connection")
        try:
            self.src_db = self.client[self.src_collection]
            print("Connected to database " + options["src_collection"] + " successfully")
        except:
            print("ERR: Unable to open database " + self.src_db)
            sys.exit()
            
        try:
            self.dest = MongoClient(dest_name)
            print("Connected to dest successfully")
        except:
            print("ERR: Unable to open client")
            sys.exit()

        # try to connect to database
        print("Validating connection")
        try:
            self.dest_db_ = self.dest[self.dest_db]
            print("Connected to database " + options['dest_db'] + " successfully")
        except:
            print("ERR: Unable to open database " + self.dest_db_)
            sys.exit()

        # try:
        #     self.dest_db = self.client[self.dest_db]
        #     print("Connected to database " + options['dest_db_name'] + " successfully")
        # except:
        #     print("ERR: Unable to open database " + self.dest_db)
        #     sys.exit()

        self.recreate_collections()

    def clear_dest_collections(self):
        dest_db_collections = self.dest_collections
        for collection_object in dest_db_collections:
            collection_name = collection_object['name']
            collection = self.dest_db[collection_name]
            print("Clearing collection: " + collection_name)
            collection.delete_many({})
            print("Collection: " + collection_name + " count: " + str(collection.estimated_document_count()))

    def recreate_collections(self):
        # self.clear_dest_collections()   # Throw out old enrollment collections
        
        src_collection = options['src_collection']
        new_collections = [options['collection_1']]
        src_db = options['src_db']
        dest_db = options['dest_db']
        
        
        # Loading new replacement collections
        splitDb = SplitCollections(src_collection, new_collections, src_db, dest_db, self.client)
        splitDb.load_collections()

db = UpdateDatabaseCollections()