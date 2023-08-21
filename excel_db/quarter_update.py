from pymongo import MongoClient
import pandas as pd
import pprint as pp
import requests
import html2text
import re
import sys
import course_web_info
from datetime import datetime
import progressbar
import pickle
import os
from get_courses_ids_from_catalog import IDcatalog
from db_utils import DbUtils
from update_robert_database import UpdateDatabaseCollections

options = {
    'term': "202203",
    'quarter': "SQ2022",
    'previous_year': "20_21",
    'extension': ".xlsx",
    # 'db_name'       : "schedule-tool",
    'db_name': "pskainth_schedule-tool",

    'pk_file_crn_map': "crn_map_dump.pkl",
    'pk_file_course_enroll': "course_enroll_dump.pkl",

    'dump_pk_crn_map': True,  # ONCE: Dump initial CRN info. Not expected to change
    # ALWAYS: Dump course enroll info in case need to use last information
    'dump_pk_course_enroll': True,
    # ALWAYS: Once saved, load dumped file to save time.
    'load_pk_crn_map': False,
    # NEED BASIS: Only when previous data is needed for debug
    'load_pk_course_enroll': False,

    # CAUTION - Will destroy collection, do only if creating new
    'clear_detail_collection': False,
    # CAUTION - Will destroy collection, do only if creating new
    'clear_enroll_collection': False,
    # ONCE: every quarter when creating new database for that quarter
    'insert_new_detail_collection': False,
    # ONCE:every quarter when creating new database for that quarter
    'insert_new_enroll_collection': True,
    # NIGHTLY: Do it when enrollment (seats) information needs update
    'update_enroll_collection': False,
}


class CurrentQuarter:

  def __init__(self):
    now = datetime.now()
    self.time_string = now.strftime("%Y-%m-%d_%X")
    print("Update time: " + self.time_string)
    # get fall 2020 course id
    # self.course_id = self.get_course_id()

    # updating enrollment (at this point, all new courses should be added)
    self.addNewCourses()

    print("Getting course names")
    self.course_id = self.get_course_id_file("sq2022_course_name.txt")
    self.course_id.sort()

    # for c in self.course_id:
    #     print(c)
    # print(self.course_id)
    # sys.exit()

    self.crn_map = {}
    self.enrollment_list = []
    self.course_list = []

    print("Getting crn's")
    if options['load_pk_crn_map']:
      # load crn from pickle data dump
      crn_map_dump_file = open(options['pk_file_crn_map'], "rb")
      self.crn_map = pickle.load(crn_map_dump_file)
      crn_map_dump_file.close()
      # print(self.crn_map)
    else:
      # get crn from html web
      self.get_CRN()

    if options['dump_pk_crn_map']:
      # save crn to pickle data dump
      crn_map_dump_file = open(options['pk_file_crn_map'], "wb")
      pickle.dump(self.crn_map, crn_map_dump_file)
      crn_map_dump_file.close()

    print("generating course info")
    if options['load_pk_course_enroll']:
      # load crn from pickle data dump
      course_enroll_dump_file = open(options['pk_file_course_enroll'], "rb")
      course_enroll_info = pickle.load(course_enroll_dump_file)
      course_enroll_dump_file.close()
      self.course_list = course_enroll_info['course']
      self.enrollment_list = course_enroll_info['enroll']
      print(self.enrollment_list[0]['seats'])
    else:
      self.gen_course_info()

    if options['dump_pk_course_enroll']:
      # save crn to pickle data dump
      course_enroll_dump_file = open(options['pk_file_course_enroll'], "wb")
      pickle.dump({'course': self.course_list,
                  'enroll': self.enrollment_list}, course_enroll_dump_file)
      course_enroll_dump_file.close()

  def addNewCourses(self):
    client_name = "mongodb+srv://scheduletool:scheduletool@schedule-tool.kbgbb.mongodb.net/" + \
        options['db_name'] + "?retryWrites=true&w=majority"
    # print(client_name)
    try:
      client = MongoClient(client_name)
      print("Connected to client successfully")
    except:
      print("ERR: Unable to open client")
      sys.exit()

    # connect to database
    try:
      db = client[options['db_name']]
      print("Connected to database " + options['db_name'] + " successfully")
    except:
      print("ERR: Unable to open database " + options['db_name'])
      sys.exit()

    # get array of previous courses
    previous_details_set = self.get_detail_course_name(db)
    previous_enrollment_set = self.get_enrollment_course_name(db)

    if(os.path.exists("sq2022_course_name_BU.txt")):
      os.remove("sq2022_course_name_BU.txt")

    if(os.path.exists("sq2022_course_name.txt")):
      os.rename("sq2022_course_name.txt", "sq2022_course_name_BU.txt")

    # get array of new courses
    id_catalog = IDcatalog()
    new_lines = id_catalog.get_course_names()
    new_set = set(new_lines)

    # compare and get new courses
    new_details_courses = new_set.difference(previous_details_set)
    new_enrollment_courses = new_set.difference(previous_enrollment_set)

    # add new courses to database
    self.get_CRN(new_details_courses)
    self.gen_course_info(new_details_courses)

    collection = db['details']
    print("inserting new courses, 'detail' collection count = " +
          str(len(self.course_list)))
    if(len(self.course_list) != 0):
      collection.insert_many(self.course_list)
      print(collection.estimated_document_count())

    self.get_CRN(new_enrollment_courses)
    self.gen_course_info(new_enrollment_courses)

    collection = db['enrollment']
    print("inserting new courses, 'enrollment' collection count = " +
          str(len(self.enrollment_list)))
    if(len(self.enrollment_list) != 0):
      collection.insert_many(self.enrollment_list)
      print(collection.estimated_document_count())

  def get_detail_course_name(self, db):

    course_names = set()

    # course collection name is "details"
    collection = db['details']

    for document in collection.find({
        "quarter": options['quarter']
    }):
      course_names.add(document["course_id"])

    return course_names

  def get_enrollment_course_name(self, db):
    course_names = set()

    # course collection name is "details"
    collection = db['enrollment']

    for document in collection.find():
      course_names.add(document["course_id"])

    return course_names

  def get_course_id_file(self, filename):
    course_name_file = open(filename, "rt")
    course_names = course_name_file.readlines()
    course_name_file.close()

     for course in quarter_courses.get_enrollment_list():
        collection.update_one(
            {
                "crn": course["crn"],
                "quarter": course["quarter"]
            },
            {
                "$push": {
                    "seats": course["seats"][0]
                }
            }
        )
        num_courses_done += 1
        bar.update(num_courses_done)

      print(collection.estimated_document_count())

    src = 'schedule-tool'
    dest = 'masterBU'
    util = DbUtils(src, dest)

    split = UpdateDatabaseCollections()
