// Bootstrap form validation script
(function () {
	'use strict';

	// Fetch all the forms we want to apply custom Bootstrap validation styles to
	var forms = document.querySelectorAll('.needs-validation');

	// Loop over them and prevent submission
	Array.prototype.slice.call(forms).forEach(function (form) {
		form.addEventListener(
			'submit',
			function (event) {
				if (!form.checkValidity()) {
					event.preventDefault();
					event.stopPropagation();
				}

				form.classList.add('was-validated');
			},
			false
		);
	});
})();

// Group deletion confirmation
// const deleteGroupButton = document.querySelector('#deleteGroup');
// deleteGroupButton.onclick = function (event) {
//     if (!confirm('هل أنت متأكد من مسحك للمجموعة')) event.preventDefault();
// };
function deleteGroupButton(groupNumber) {
	if (!confirm(`هل أنت متأكد من مسحك للمجموعة ${groupNumber}`)) event.preventDefault();
}

// Copy todays program
function copyText(htmlElement) {
	if (!htmlElement) return;

	var range = document.createRange(); // new Range object
	range.selectNodeContents(htmlElement); // sets the Range to contain the contents of a Node

	var selection = window.getSelection(); // a Selection object representing the range of text
	// selected by the user or the current position of the caret.
	selection.removeAllRanges(); // removes all ranges from the selection
	selection.addRange(range); // adds a Range to a Selection

	document.execCommand('copy'); // Copies the current selection to the clipboard
	selection.removeAllRanges(); // removes all ranges from the selection

	alert('لقد تم نسخ البرنامج');
}

document.querySelector('#copyButton').onclick = function () {
	copyText(document.querySelector('#todaysProgramText'));
};
