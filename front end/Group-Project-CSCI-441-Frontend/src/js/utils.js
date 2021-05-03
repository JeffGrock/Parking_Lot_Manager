"use strict";

/*!
 * Sanitize and encode all HTML in a user-submitted string
 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {String} str  The user-submitted string
 * @return {String} str  The sanitized string
 */
const sanitizeHTML = function (str) {
	let temp = document.createElement('div');
	temp.textContent = str.trim();
	return temp.innerHTML;
};

/**
 * @desc Return the date in "YYYY-MM-DD" format
 *
 * @param {Object} date - Date object
 * @returns {string} - "YYYY-MM-DD"
 */
function formatDate(date) {
	const formattedDate = new Date(date);
	return formattedDate.toISOString().split('T')[0];
}