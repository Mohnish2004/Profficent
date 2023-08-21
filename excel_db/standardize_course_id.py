from db_utils import DbUtils
from pymongo import MongoClient


def main():
  # Connect to client
  mongo_client = MongoClient("mongodb+srv://lunchroom_admin:$$Lunchr33m@cluster0.u1fmi.mongodb.net/" + "Cluster0" +"?retryWrites=true&w=majority")
    #   "mongodb+srv://scheduletool:scheduletool@schedule-tool.kbgbb.mongodb.net/" + "schedule-tool" + "?retryWrites=true&w=majority")

  # Connect to database
  db = mongo_client["standardized-course-id"]

  # Connect to collection
  col = db["details"]

  # Standardize courses with single digit code values
  print("Standardizing courses with single digit code values...")
  update_result = col.update_many({"code": {"$regex": "^\d{1}$"}}, [
      {"$set": {"code": {"$concat": ["00", "$code"]}}}])
  print(" Update acknowledged:", update_result.acknowledged)
  print(" Matched", update_result.matched_count, "documents")
  print(" Modified", update_result.modified_count, "documents", "\n")

  # Standardize courses with two digit code values
  print("Standardizing courses with two digit code values...")
  update_result = col.update_many({"code": {"$regex": "^\d{2}$"}}, [
      {"$set": {"code": {"$concat": ["0", "$code"]}}}])
  print(" Update acknowledged:", update_result.acknowledged)
  print(" Matched", update_result.matched_count, "documents")
  print(" Modified", update_result.modified_count, "documents", "\n")

  # Update "course_id" using updated course codes
  print("Updating all \"course_id\" using updated course codes...")
  update_result = col.update_many({}, [
      {"$set": {"course_id": {"$concat": ["$subj", "$code"]}}}])
  print(" Update acknowledged:", update_result.acknowledged)


if __name__ == "__main__":
  src = "schedule-tool"
  dest = "standardized-course-id"
  util = DbUtils(src, dest)
  main()
