# Read the file
with open('new_companies.txt', 'r') as infile:
    lines = infile.readlines()

# Append " career" to each company name
updated_lines = [line.strip() + " careers\n" for line in lines]

# Write the updated lines to a new file
with open('levels_companies_with_career.txt', 'w') as outfile:
    outfile.writelines(updated_lines)
