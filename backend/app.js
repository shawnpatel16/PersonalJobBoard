const express = require("express");
const cors = require('cors')
const app = express();
app.use(cors());
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const sampleData = [
  "https://www.crunchyroll.com/about/jobs/",
  "https://www.amazon.jobs/en/job_categories/software-development",
  "https://careers.abarcahealth.com/",
  "https://bah.wd1.myworkdayjobs.com/en-US/BAH_Jobs?redirect=/en-US/BAH_Jobs/userHome",
  "https://workday.wd5.myworkdayjobs.com/Workday?Location_Country=bc33aa3152ec42d4995f4791a106ed09",
  "https://jobs.bytedance.com/en/campus",
  "https://stripe.com/jobs/search",
  "https://boards.greenhouse.io/crunchyroll/jobs/4896980?gh_jid=4896980", 
  "https://jobs.lever.co/symplicity/8d69ce1d-af08-4172-b7a3-74ac8700b69b/apply?lever-source=Simplify"
];
app.use(express.json()); // for parsing JSON
app.get("/api/companies", async (req, res) => {
  const companies = await prisma.company.findMany();
  res.json(companies);
});

app.post("/api/companies", async (req, res) => {
  const links = req.body.links; // Expecting an array of links
  const newCompanies = [];
  console.log(links);

  for (const link of links) {
    // Check if the link starts with 'https://'
    if (link.startsWith("https://")) {
      const companyName = extractCompanyName(link);

      if (companyName) {
        const existingCompany = await prisma.company.findFirst({
          where: {
            OR: [{ companyName: companyName }, { link: link }],
          },
        });

        if (!existingCompany) {
          const newCompany = await prisma.company.create({
            data: {
              link: link,
              companyName: companyName,
            },
          });
          newCompanies.push(newCompany);
        }
      }
    }
  }

  res.json(newCompanies);
});

app.delete('/api/companies/:companyName', async (req, res) => {
  const companyName = req.params.companyName
  const link = req.body.link
  console.log(link)
  const deletedCompany = await prisma.company.delete({
    where: {
      companyName: companyName,
      link:link
    },
  });
  console.log(deletedCompany)
  
  return res.status(200).json({ message: "Company deleted" });
    
  
});

app.put("/api/companies", async (req, res) => {
  const { oldLink, oldName, newLink, newName } = req.body; // Extracting values from request body

  if (!oldLink || (!newLink && !newName)) {
    return res.status(400).json({ message: "Incomplete update parameters" });
  }

  let updateData = {};

  if (newLink) {
    updateData.link = newLink;
  } else {
    updateData.link = oldLink
  }

  if (newName) {
    updateData.companyName = newName;
  } else {
    updateData.companyName = oldName
  }

  const updatedCompany = await prisma.company.updateMany({
    where: {
      link: oldLink,
    },
    data: updateData,
  });

  if (updatedCompany.count > 0) {
    return res.status(200).json({ message: "Company updated" });
  } else {
    return res.status(404).json({ message: "Company not found" });
  }
});


function extractCompanyName(url) {
  // Remove protocol, www, and query parameters
  if (url.includes("boards.greenhouse.io")) {
    return url.split("/")[3];
  }

  if (url.includes("jobs.lever.co")) {
    return url.split("/")[3];
  }
  const cleanUrl = url.replace(/(https?:\/\/)?(www\.)?/, "").split(/[/?#]/)[0];

  // Identify subdomains or paths that shouldn't be part of the company name
  const excludes = [
    "careers",
    "jobs",
    "corp",
    "myworkdayjobs",
    "boards",
    "greenhouse",
    "lever",
    "com",
    "io",
    "wd",
    "co"
  ];

  // Remove parts that start with "wd" followed by numbers
  const cleanedParts = cleanUrl
    .split(".")
    .filter((part) => !/^wd[0-9]+$/.test(part));

  // Filter out excluded parts
  const parts = cleanedParts.filter((part) => !excludes.includes(part));

  if (parts.length === 0) return null;

  // Special handling for greenhouse.io boards
  if (cleanUrl.includes("boards.greenhouse.io")) {
    return url.split("/")[3];
  }

  // General case: The company name is usually the second last part of the domain
  return parts[0] // Fallback to the first part if only one part remains
}
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

