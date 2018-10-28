/**
 * +--------------------------------------------------------------------+
 * | This HTML_CodeSniffer file is Copyright (c)                        |
 * | Squiz Pty Ltd (ABN 77 084 670 600)                                 |
 * +--------------------------------------------------------------------+
 * | IMPORTANT: Your use of this Software is subject to the terms of    |
 * | the Licence provided in the file licence.txt. If you cannot find   |
 * | this file please contact Squiz (www.squiz.com.au) so we may        |
 * | provide you a copy.                                                |
 * +--------------------------------------------------------------------+
 *
 */

_global.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_4_1_4_6 = {
    /**
     * Determines the elements to register for processing.
     *
     * Each element of the returned array can either be an element name, or "_top"
     * which is the top element of the tested code.
     *
     * @returns {Array} The list of elements.
     */
    register: function()
    {
        return ['_top'];

    },

    /**
     * Process the registered element.
     *
     * @param {DOMNode} element The element registered.
     * @param {DOMNode} top     The top element of the tested code.
     */
    process: function(element, top)
    {
        if (element === top) {
            var failures = HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_4_1_4_3_Contrast.testContrastRatio(top, 7.0, 4.5);

            for (var i = 0; i < failures.length; i++) {
                var element   = failures[i].element;
                
                var decimals  = 2;
                var value     = (Math.round(failures[i].value * Math.pow(10, decimals)) / Math.pow(10, decimals));
                var required  = failures[i].required;
                var recommend = failures[i].recommendation;
                var fontSize = failures[i].fontSize;
                var hasBgImg  = failures[i].hasBgImage || false;
                var isAbsolute = failures[i].isAbsolute || false;
                var colour = failures[i].colour;
                var bgColour = failures[i].bgColour;
                var bgRepeat = failures[i].bgRepeat;
                var bgSize = failures[i].bgSize;
                var bgPosition = failures[i].bgPosition;
                var fontWeight = failures[i].fontWeight;
                var bgImg = failures[i].bgImg || '';
                var fontSizePixels = failures[i].fontSizePixels;
                var minLargeSize = failures[i].minLargeSize;
                var backgrounds = failures[i].backgrounds;

                // If the values would look identical, add decimals to the value.
                while (required === value) {
                    decimals++;
                    value = (Math.round(failures[i].value * Math.pow(10, decimals)) / Math.pow(10, decimals));
                }

                var code;
                if (required === 4.5) {
                    code = 'G18';
                } else if (required === 7.0) {
                    code = 'G17';
                }

                var recommendText = [];
                if (recommend) {
                    if (recommend.fore.from !== recommend.fore.to) {
                        recommendText.push(_global.HTMLCS.getTranslation("1_4_6_G18_or_G17.Fail.Recomendation.Text") + ' ' + recommend.fore.to);
                    }
                    if (recommend.back.from !== recommend.back.to) {
                        recommendText.push(_global.HTMLCS.getTranslation("1_4_6_G18_or_G17.Fail.Recomendation.Background") + recommend.back.to);
                    }
                }//end if

                if (recommendText.length > 0) {
                    recommendText = ' ' + _global.HTMLCS.getTranslation("1_4_6_G18_or_G17.Fail.Recomendation") + ' ' + recommendText.join(', ') + '.';
                }

                if (isAbsolute === true) {
                    code += '.Abs';
                    HTMLCS.addMessage(HTMLCS.WARNING, element, _global.HTMLCS.getTranslation("1_4_6_G18_or_G17.Abs").replace(/\{\{required\}\}/g, required), code, {
                      color: colour,
                      bgColor: bgColour,
                      fontSize: fontSize,
                        bgImg: bgImg,
                        bgRepeat: bgRepeat,
                        bgSize: bgSize,
                        bgPosition: bgPosition,
                        backgrounds: backgrounds,
                        fontSizePixels: fontSizePixels,
                        fontWeight: fontWeight,
                        minLargeSize: minLargeSize,
                        isLarge: fontSize >= minLargeSize,
                        contrast: value,
                        requiredContrast: required,
                        recommend: recommend,
                    });
                } else if (hasBgImg === true) {
                    code += '.BgImage';
                    HTMLCS.addMessage(HTMLCS.WARNING, element, _global.HTMLCS.getTranslation("1_4_6_G18_or_G17.BgImage").replace(/\{\{required\}\}/g, required), code, {
                      color: colour,
                      bgColor: bgColour,
                      hasBgImage: hasBgImg,
                      fontSize: fontSize,
                        bgImg: bgImg,
                        bgRepeat: bgRepeat,
                        bgSize: bgSize,
                        bgPosition: bgPosition,
                        backgrounds: backgrounds,
                        fontSizePixels: fontSizePixels,
                        fontWeight: fontWeight,
                        minLargeSize: minLargeSize,
                        isLarge: fontSize >= minLargeSize,
                        contrast: value,
                        requiredContrast: required,
                        recommend: recommend,
                    });
                } else {
                    code += '.Fail';
                    HTMLCS.addMessage(HTMLCS.ERROR, element, _global.HTMLCS.getTranslation("1_4_6_G18_or_G17.Fail").replace(/\{\{required\}\}/g, required).replace(/\{\{value\}\}/g, value) + recommendText, code, {
                        color: colour,
                        bgColor: bgColour,
                        fontSize: fontSize,
                        hasBgImage: hasBgImg,
                        bgImg: bgImg,
                        bgRepeat: bgRepeat,
                        bgSize: bgSize,
                        bgPosition: bgPosition,
                        backgrounds: backgrounds,
                        fontSizePixels: fontSizePixels,
                        fontWeight: fontWeight,
                        minLargeSize: minLargeSize,
                        isLarge: fontSize >= minLargeSize,
                        contrast: value,
                        requiredContrast: required,
                        recommend: recommend,
                    });
                }//end if
            }//end for
        }//end if
    }
};
