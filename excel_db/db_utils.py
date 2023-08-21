from pymongo import MongoClient
import pprint as pp
import pickle
import sys


class DbUtils:
  def __init__(self, src, dest):
    self.src = src
    self.dest = dest

    print("Connecting to Mongo DB")
    self.src_client = MongoClient(
        "mongodb+srv://lunchroom_admin:$$Lunchr33m@cluster0.u1fmi.mongodb.net/" + self.src +"?retryWrites=true&w=majority")
    self.dest_client = MongoClient("mongodb+srv://lunchroom_admin:$$Lunchr33m@cluster0.u1fmi.mongodb.net/" + self.dest +"?retryWrites=true&w=majority")
        # "mongodb+srv://scheduletool:scheduletool@schedule-tool.kbgbb.mongodb.net/" + self.dest + "?retryWrites=true&w=majority")

    # try to connect to database
    print("Validating connection")
    try:
      db_list = self.src_client.list_database_names()
      print(db_list)
    except Exception as e:
      print("ERR: Unable to open client")
      print(e)
      sys.exit()

    print("passed")
    try:
      db_list = self.dest_client.list_database_names()
      print(db_list)
    except:
      print("ERR: Unable to open client")
      sys.exit()

    self.backup()
    self.clear()
    self.restore()

  def backup(self):
    db = self.src_client[self.src]

    for collection_name in db.list_collection_names():
      collection = db[collection_name]
      print("Reading from database")
      documents = collection.find({})
      doc_list = []
      for d in documents:
        doc_list.append(d)
      print(collection.estimated_document_count())
      db_file = "dbutils_" + collection_name + ".db"
      print("Writing pickle file " + db_file)
      db_file_handle = open(db_file, "wb")
      pickle.dump(doc_list, db_file_handle)
      db_file_handle.close()

  def clear(self):
    db = self.dest_client[self.dest]

    for collection_name in db.list_collection_names():
      collection = db[collection_name]
      print("Clearing collection: " + collection_name)
      collection.delete_many({})
      print("Collection: " + collection_name + " count: " +
            str(collection.estimated_document_count()))

  def restore(self):
    db = self.dest_client[self.dest]

    for collection_name in db.list_collection_names():
      collection = db[collection_name]
      db_file = "dbutils_" + collection_name + ".db"
      print("Reading pickle file " + db_file)
      db_file_handle = open(db_file, "rb")
      documents = pickle.load(db_file_handle)
      db_file_handle.close()
      # insert all of the data into the database
      print("Writing to database")
      collection.insert_many(documents)
      print(collection.estimated_document_count())
