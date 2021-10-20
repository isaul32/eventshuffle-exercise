-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "people" TEXT[],
    "dates" DATE[],

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "date" DATE NOT NULL,
    "name" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Vote_name_date_key" ON "Vote"("name", "date");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
