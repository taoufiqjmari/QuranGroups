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
