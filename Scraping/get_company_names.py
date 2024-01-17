### ONLY WORKS WITH SIMPLIFY PAGE ###
# Read the lines from the text file
with open('companies.txt', 'r') as f:
    lines = f.readlines()

# Initialize an empty list to store company names
company_names = []

# Iterate through lines, skipping 4 lines for every company name found
for i in range(0, len(lines), 5):
    # Get the company name and strip any leading/trailing white spaces
    company_name = lines[i].strip()
    # Append it to our list of company names
    company_names.append(company_name)

# Write the company names to a new text file
with open('company_names.txt', 'w') as f:
    for name in company_names:
        f.write(f"{name}\n")

# Print out the company names

