import re
import sys
import pprint
import requests
import html2text
import progressbar

class IDcatalog:

    def __init__(self):

        pp = pprint.PrettyPrinter(indent=2, width=200)

        course_catalog_text = "./GenCat20212022.txt"

        catalog_text_file = open(course_catalog_text, 'rt', encoding="utf8")
        catalog_text = catalog_text_file.read()
        catalog_text_file.close()

        match = re.findall(r"([A-Z]{3}\s+\d\d\d\S*)—\S+.*?", catalog_text, flags=re.M)
        print("Number of courses found " + str(len(match)))
        #pp.pprint(match)

        course_category = set()
        for m in match:
            course_category.add(m.split()[0])
        course_category = list(course_category)
        course_category.sort()
        print("Number of courses category found " + str(len(course_category)))
        # pp.pprint(course_category)

        count = 0
        bar = progressbar.ProgressBar(max_value=len(course_category))
        course_id = set()
        for c in course_category:
            url = "https://registrar-apps.ucdavis.edu/courses/search/course_search_results.cfm?course_number=" + c + "&termCode=202203"
            # print(url)

            r = requests.get(url)
            if(r.status_code != 200):
                print("Error: could not access course")
                sys.exit()
            
            text = html2text.html2text(r.text)
            # print(text)
            match = re.findall(r"\*\*\d+\*\*.*?\|\s+(\S+\s+\S+)", text, re.S)
            # print(match)

            for m in match:
                course_id.add(m)

            count = count + 1
            bar.update(count)


        course_id = list(course_id)
        course_id.sort()
        # print(course_id)
        print("Number of unique courses found " + str(len(course_id)))
        #pp.pprint(course_id)

        course_list_file = open("sq2022_course_name.txt", "wt")
        self.course_names = []
        for c in course_id:
            c = "".join(c.split())
            course_list_file.writelines(c + "\n")
            self.course_names.append(c)
        course_list_file.close()

    def get_course_names(self):
        return self.course_names

# id = IDcatalog()
# print(id.get_course_names())