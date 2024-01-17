# Read the companies from the first file
with open('simplify_companies.txt', 'r') as f1:
    companies1 = set(f1.read().splitlines())

# Read the companies from the second file
with open('levels_companies.txt', 'r') as f2:
    companies2 = set(f2.read().splitlines())

# Find the companies that are in the second file but not in the first
new_companies = companies2.difference(companies1)

# Write these new companies to a new file
with open('new_companies.txt', 'w') as f_new:
    for company in new_companies:
        f_new.write(f"{company}\n")
