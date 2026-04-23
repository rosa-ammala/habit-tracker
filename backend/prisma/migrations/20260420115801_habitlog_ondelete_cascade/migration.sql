-- DropForeignKey
ALTER TABLE `habitlog` DROP FOREIGN KEY `HabitLog_habitId_fkey`;

-- AddForeignKey
ALTER TABLE `HabitLog` ADD CONSTRAINT `HabitLog_habitId_fkey` FOREIGN KEY (`habitId`) REFERENCES `Habit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
