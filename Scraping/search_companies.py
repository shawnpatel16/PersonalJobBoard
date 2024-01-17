try:
    from googlesearch import search
except ImportError:
    print("No module named 'google' found")

# Read the list of companies from a file
with open("levels_companies_with_career.txt", "r") as f:
    companies = f.readlines()

# Open a new file to write the output
with open("levels_companies_with_links.txt", "w") as f:
    for company in companies:
        company = company.strip()
        query = company

        # Search and fetch the first link
        for link in search(query, tld="com", num=1, stop=1, pause=2):
            f.write(f"{company}\t{link}\n")
