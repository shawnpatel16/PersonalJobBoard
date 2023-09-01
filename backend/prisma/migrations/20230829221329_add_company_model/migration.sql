-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "link" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_link_key" ON "Company"("link");
