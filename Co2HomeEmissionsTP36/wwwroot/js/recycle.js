jQuery(document).ready(function ($) {
    handleImageUploadForm();
});

function handleImageUploadForm() {
    $('#image-upload').on('change', function() {
        let fileName = $(this).val().split('\\').pop();
        $('#image-name-display').text('Selected Image: ' + fileName);
    });

    $('#image-uploader').on('submit', function(event) {
        if($('#image-upload').get(0).files.length === 0) {
            event.preventDefault(); // Prevent form submission
        }
        else
        {
            let fileSize = $('#image-upload').get(0).files[0].size; // Size in bytes
            let maxSize = 4 * 1024 * 1024; // 4MB in bytes
    
            if(fileSize > maxSize) {
                event.preventDefault(); // Prevent form submission
            }
            else {
                $('.loading-spinner').show();
            }
        }
    });
}
