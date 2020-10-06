const moment = require('moment');
const {momentDate} = require('../utils/momentDate');

module.exports = {
	name: 'absent',
	adminOnly: true,
	execute(message, args) {
		const {channelIDs, guildID, msgIDs} = message.client.config;
		const guildObj = message.client.guilds.cache.get(guildID);
		const adminAbsence = guildObj.channels.cache.get(channelIDs.adminAbsence);
		const datePattern = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))$/;
		const raidDays = [3, 4, 7];
		let absenceAdded = false;
		let longTerm, shortTerm, isAbsent, dateGiven;
		let currentDate = moment();

		if (args) {
			if (datePattern.test(args[0])) {
				dateGiven = true;
				currentDate = momentDate(args[0]);
			}
		}

		const currentDay = currentDate.isoWeekday();
		let absentList = dateGiven ? `Raiders absent on the ${currentDate.format('DD/MM')}\n` : 'Raiders Absent for next raid:\n';

		adminAbsence.messages.fetch(msgIDs.longTerm).then(longMsg => {
			longTerm = longMsg;

			adminAbsence.messages.fetch(msgIDs.shortTerm).then(shortMsg => {
				shortTerm = shortMsg;

				const shortAbsencePostArray = shortTerm.content.split('**Raider:**').slice(1);
				const longAbsencePostArray = longTerm.content.split('**Raider:**').slice(1);
				const absencePostArray = shortAbsencePostArray.concat(longAbsencePostArray);

				if (raidDays.includes(currentDay)) {
					for (const absencePost of absencePostArray) {
						const raiderAbsent = absencePost.slice(0, 22);
						const indexOfStartDate = absencePost.indexOf('**Start Date:**') + 16;
						const startDate = momentDate(absencePost.slice(indexOfStartDate, indexOfStartDate + 5));
						const indexOfEndDate = absencePost.indexOf('**End Date:**') + 14;
						const endDate = momentDate(absencePost.slice(indexOfEndDate, indexOfEndDate + 5));

						if (currentDate.isSame(startDate, 'd')) {
							isAbsent = true;
						} else {
							isAbsent = currentDate.isBetween(startDate, endDate, 'd');

						}

						if (isAbsent) {
							absentList += `-${raiderAbsent}\n`;
							absenceAdded = true;
						}

						if (endDate.isBefore(currentDate) && !endDate.isSame(currentDate, 'd')) {
							if (shortAbsencePostArray.includes(absencePost)) {
								adminAbsence.messages.fetch(msgIDs.shortTerm).then(msgToEdit => {
									msgToEdit.edit(`${msgToEdit.content.replace(`**Raider:**${absencePost}`, '')}`);
								});
							} else {
								adminAbsence.messages.fetch(msgIDs.longTerm).then(msgToEdit => {
									msgToEdit.edit(`${msgToEdit.content.replace(`**Raider:**${absencePost}`, '')}`);
								});
							}
						}
					}

					if (absenceAdded) {
						message.channel.send(absentList);
					} else {
						message.channel.send('There are no absences for next raid!');
					}

				} else if (currentDay < 3) {
					const nextRaid = moment().add(3 - currentDay, 'd');

					for (const absencePost of absencePostArray) {
						const raiderAbsent = absencePost.slice(0, 22);
						const indexOfStartDate = absencePost.indexOf('**Start Date:**') + 16;
						const startDate = momentDate(absencePost.slice(indexOfStartDate, indexOfStartDate + 5));
						const indexOfEndDate = absencePost.indexOf('**End Date:**') + 14;
						const endDate = momentDate(absencePost.slice(indexOfEndDate, indexOfEndDate + 5));

						if (nextRaid.isSame(startDate, 'd')) {
							isAbsent = true;
						} else {
							isAbsent = nextRaid.isBetween(startDate, endDate, 'd');

						}

						if (isAbsent) {
							absentList += `-${raiderAbsent}\n`;
							absenceAdded = true;
						}

						if (endDate.isBefore(nextRaid) && !endDate.isSame(nextRaid, 'd')) {
							if (shortAbsencePostArray.includes(absencePost)) {
								adminAbsence.messages.fetch(msgIDs.shortTerm).then(msgToEdit => {
									msgToEdit.edit(`${msgToEdit.content.replace(`**Raider:**${absencePost}`, '')}`);
								});
							} else {
								adminAbsence.messages.fetch(msgIDs.longTerm).then(msgToEdit => {
									msgToEdit.edit(`${msgToEdit.content.replace(`**Raider:**${absencePost}`, '')}`);
								});
							}
						}
					}

					if (absenceAdded) {
						message.channel.send(absentList);
					} else {
						message.channel.send('There are no absences for next raid!');
					}

				} else if (currentDay > 3) {
					const nextRaid = moment().add(7 - currentDay, 'd');

					for (const absencePost of absencePostArray) {
						const raiderAbsent = absencePost.slice(0, 22);
						const indexOfStartDate = absencePost.indexOf('**Start Date:**') + 16;
						const startDate = momentDate(absencePost.slice(indexOfStartDate, indexOfStartDate + 5));
						const indexOfEndDate = absencePost.indexOf('**End Date:**') + 14;
						const endDate = momentDate(absencePost.slice(indexOfEndDate, indexOfEndDate + 5));

						if (nextRaid.isSame(startDate, 'd')) {
							isAbsent = true;
						} else {
							isAbsent = nextRaid.isBetween(startDate, endDate, 'd');

						}

						if (isAbsent) {
							absentList += `-${raiderAbsent}\n`;
							absenceAdded = true;
						}

						if (endDate.isBefore(nextRaid) && !endDate.isSame(nextRaid, 'd')) {
							if (shortAbsencePostArray.includes(absencePost)) {
								adminAbsence.messages.fetch(msgIDs.shortTerm).then(msgToEdit => {
									msgToEdit.edit(`${msgToEdit.content.replace(`**Raider:**${absencePost}`, '')}`);
								});
							} else {
								adminAbsence.messages.fetch(msgIDs.longTerm).then(msgToEdit => {
									msgToEdit.edit(`${msgToEdit.content.replace(`**Raider:**${absencePost}`, '')}`);
								});
							}
						}
					}

					if (absenceAdded) {
						message.channel.send(absentList);
					} else {
						message.channel.send('There are no absences for next raid!');
					}
				}
			});
		});

	}
};
