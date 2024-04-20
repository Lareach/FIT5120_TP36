jQuery(document).ready(function ($) {
    showHideQuestionnaire();
    uncheckInput();
    clickAccordion();
    handleCalculator();
});

// Display one question at a time
function showHideQuestionnaire() {
    var currentQuestion = 1;

    // Initially disable the next button
    $("#nextButton").prop("disabled", true);

    // Check if at least one option is selected before enabling the next button
    $(".question").each(function () {
        $(this).find(":input").change(function () {
            var isValid = $(this).closest(".question").find(":input:checked").length > 0;
            $("#nextButton").prop("disabled", !isValid);
        });
    });

    // Next button click event
    $("#nextButton").click(function () {
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
    $("#backButton").click(function () {
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
function uncheckInput() {
    $('#noneOfTheAbove').change(function () {
        if ($(this).is(':checked')) {
            $('input[name="utilityBill"]').prop('checked', false);
            $('#noneOfTheAbove').prop('checked', true);
        }
    });

    $('input[name="utilityBill"]').not('#noneOfTheAbove').change(function () {
        if ($(this).is(':checked')) {
            $('#noneOfTheAbove').prop('checked', false);
        }
    });

    $('#noneOfTheAboveConcession').change(function () {
        if ($(this).is(':checked')) {
            $('input[name="concessionCards"]').prop('checked', false);
            $('#noneOfTheAboveConcession').prop('checked', true);
        }
    });

    $('input[name="concessionCards"]').not('#noneOfTheAboveConcession').change(function () {
        if ($(this).is(':checked')) {
            $('#noneOfTheAboveConcession').prop('checked', false);
        }
    });
}

// Open and close accordion
function clickAccordion() {
    $.each($(".accordion-container"), function (i) {
        $(this).addClass("_" + (i + 1));
    });

    let moduleCount = $(".accordion-container").length;

    for (let j = 1; j <= moduleCount; j++) {
        let currentModule = ".accordion-container._" + j + " ";

        $(currentModule + '.questionnaire-accordion-head').click(function (e) {
            $(currentModule + ".questionnaire-accordion-head-icon").toggleClass("accordion-no-rotate accordion-rotate");
            $(currentModule + ".questionnaire-accordion-tail").toggleClass("accordion-open accordion-close");
        });
    }
}


function handleCalculator() {
    var subPageIndex = 0;
    var pageList = ['main']
    var main = $('#calculator-main');
    main.show();
    var subOptions = [];
    var inputValueMap = {};
    main.find(":input").change(function () {
        var checkedList = $(this).closest(".question").find(":input:checked");
        var isValid = checkedList.length > 0;
        subOptions = [];
        checkedList.each(function () {
            subOptions.push($(this).val());
        });
        $(".next-btn").prop("disabled", !isValid);
    });
    $('#cb-calculator input').on('input', function () {
        var key = $(this).attr('name')
        var target = inputValueMap[key] = inputValueMap[key] || [];
        var val = $(this).val();

        if ($(this).attr('type') === 'checkbox') {
            if ($(this).is(':checked')) {
                target.push(val)
            } else {
                target = target.filter(function (value) {
                    return value !== val
                })
            }
        } else {
            inputValueMap[key] = [val]
        }

        var currentPage = pageList[pageList.length - 1];
        if (inputValueMap[currentPage]) {
            var hasVal = inputValueMap[currentPage].length > 0
            $('.next-btn').prop("disabled", !hasVal);
            $('.submit-btn').prop("disabled", subPageIndex >= subOptions.length && !hasVal);
        }
    })
    $('#cb-calculator button').click(function () {
        var isNext = $(this).hasClass("next-btn");
        var isPrev = $(this).hasClass("back-btn");
        var isSubmit = $(this).hasClass("submit-btn");
        // console.log(isNext, pageList, subPageIndex, subOptions);

        $('.question').hide();
        if (isNext) {
            var nextPage = subOptions[subPageIndex]
            $('#calculator-' + nextPage).show();
            subPageIndex++;
            pageList.push(nextPage);
        } else if (isPrev) {
            if (subPageIndex > 0) {
                subPageIndex--;
            }
            pageList.pop();
            $('#calculator-' + pageList[pageList.length - 1]).show();
        } else {
            $('#calculator-result').show();
            pageList.push('result');
            calculateAll(inputValueMap);
        }

        var currentPage = pageList[pageList.length - 1];
        var hasVal = !!inputValueMap[currentPage] && inputValueMap[currentPage].length > 0
        $('.next-btn').prop("disabled", !hasVal);
        $('.submit-btn').prop("disabled", !hasVal);
        // console.log('hasVal: ', hasVal, currentPage);

        if (pageList.length > 1) {
            $('.back-btn').show();
        } else {
            $('.back-btn').hide();
        }

        var len = subOptions.length;
        len = isPrev ? len - 1 : len;
        if (subPageIndex >= len) {
            $('.next-btn').hide();
            if (currentPage === 'result') {
                $('.submit-btn').hide();
            } else {
                $('.submit-btn').show();
            }
        } else if (isSubmit) {
            $('.submit-btn').hide();
        } else {
            $('.next-btn').show();
            $('.submit-btn').hide();
        }

    });
}

function calculateAll(map) {
    console.log('calculateAll', map);
    var total = BigNumber(0);
    var result = $('#calculator-result-num');

    var keyMap = {
        'Electricity': 'electricity',
        'Natural Gas': 'gas',
        'LPG': 'lpg',
        'Firewood': 'firewood',
    }

    jQuery.getJSON('/api/energy', function(data) {
        for (let i = 0; i < data.length; i++) {
            const ele = data[i];
            var key = keyMap[ele['energyName']];
            var inputValue = map[key]
            if (!inputValue) {
                continue;
            }
            var Q = inputValue[0];
            var EC = BigNumber(ele['energyContentFactor'] || 0);
            var EF_SUM = BigNumber(ele['scopeOneEmission'] || 0).plus(ele['scopeTwoEmission'] || 0).plus(ele['scopeThreeEmission'] || 0);
            var resultNum = EF_SUM.times(EC).times(Q).div(1000);
            console.log('resultNum: ', resultNum, "key: ", key, "ele: ", ele, "Q: ", Q, "EC: ", EC, "EF_SUM: ", EF_SUM);
            total = total.plus(resultNum);
        }
        var totalResult = total.toFixed(4)
        console.log('total: ', totalResult);
        result.text(totalResult);
    })
}