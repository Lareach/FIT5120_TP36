jQuery(document).ready(function($) {
    showHideQuestionnaire();
    uncheckInput();
    clickAccordion();
});

// Display one question at a time
function showHideQuestionnaire()
{
    var currentQuestion = 1;

    // Initially disable the next button
    $("#nextButton").prop("disabled", true);

    // Check if at least one option is selected before enabling the next button
    $(".question").each(function() {
        $(this).find(":input").change(function() {
            var isValid = $(this).closest(".question").find(":input:checked").length > 0;
            $("#nextButton").prop("disabled", !isValid);
        });
    });

    // Next button click event
    $("#nextButton").click(function() {
        $("#question" + currentQuestion).hide();
        currentQuestion++;
        if (currentQuestion <= 4) {
            $("#question" + currentQuestion).show();
            $("#backButton").show();
        }
        if (currentQuestion === 4) {
            $("#nextButton").hide();
            $("#submitButton").show();
        }
        // Disable next button if no option is selected
        $("#nextButton").prop("disabled", true);

        if ($("#question" + currentQuestion).find(":input:checked").length > 0) {
            $("#nextButton").prop("disabled", false);
        }
    });

    // Back button click event
    $("#backButton").click(function() {
        $("#question" + currentQuestion).hide();
        currentQuestion--;
        if (currentQuestion >= 1) {
            $("#question" + currentQuestion).show();
            if (currentQuestion === 1) {
                $("#backButton").hide();
            }
            if (currentQuestion < 4) {
                $("#nextButton").show();
                $("#submitButton").hide();
            }
        }

        $("#nextButton").prop("disabled", false);
    });
}

// Uncheck inputs if the none of the above input is selected
function uncheckInput()
{
    $('#noneOfTheAbove').change(function() {
        if ($(this).is(':checked')) {
            $('input[name="utilityBill"]').prop('checked', false);
            $('#noneOfTheAbove').prop('checked', true);
        }
    });

    $('input[name="utilityBill"]').not('#noneOfTheAbove').change(function() {
        if ($(this).is(':checked')) {
            $('#noneOfTheAbove').prop('checked', false);
        }
    });

    $('#noneOfTheAboveConcession').change(function() {
        if ($(this).is(':checked')) {
            $('input[name="concessionCards"]').prop('checked', false);
            $('#noneOfTheAboveConcession').prop('checked', true);
        }
    });

    $('input[name="concessionCards"]').not('#noneOfTheAboveConcession').change(function() {
        if ($(this).is(':checked')) {
            $('#noneOfTheAboveConcession').prop('checked', false);
        }
    });
}

// Open and close accordion
function clickAccordion()
{
    $.each($(".accordion-container"), function(i) {
        $(this).addClass("_" + (i + 1));
    });

    let moduleCount = $(".accordion-container").length;

    for(let j = 1; j <= moduleCount; j++) {
        let currentModule = ".accordion-container._" + j + " ";

        $(currentModule + '.questionnaire-accordion-head').click(function(e) {
            $(currentModule + ".questionnaire-accordion-head-icon").toggleClass("accordion-no-rotate accordion-rotate");
            $(currentModule + ".questionnaire-accordion-tail").toggleClass("accordion-open accordion-close");
        });
    }
}
