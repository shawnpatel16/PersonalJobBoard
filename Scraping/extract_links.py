# Create an empty list to store extracted URLs
extracted_urls = []

# Open the text file and read line by line
with open("companies_with_links.txt", "r") as file:
    for line in file:
        # Split the line by space and get the last element, assuming it's the URL
        url = line.split()[-1]
        extracted_urls.append(url)

# Write the extracted URLs to a new text file
with open("extracted_urls.txt", "w") as output_file:
    for url in extracted_urls:
        output_file.write(f"{url}\n")

print("URLs extracted and saved to 'extracted_urls.txt'")
