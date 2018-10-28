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

_global.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_4_1_4_3 = {
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
            var failures = HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_4_1_4_3_Contrast.testContrastRatio(top, 4.5, 3.0);

            for (var i = 0; i < failures.length; i++) {
                var element   = failures[i].element;
                
                var decimals  = 2;
                var value     = (Math.round(failures[i].value * Math.pow(10, decimals)) / Math.pow(10, decimals));
                var required  = failures[i].required;
                var recommend = failures[i].recommendation;
                var hasBgImg  = failures[i].hasBgImage || false;
                var bgRepeat  = failures[i].bgRepeat;
                var bgSize = failures[i].bgSize;
                  var colour = failures[i].colour || false;
                  var fontSize = failures[i].fontSize;
                  var bgColour = failures[i].bgColour;
                var isAbsolute = failures[i].isAbsolute || false;
                var bgImg = failures[i].bgImg || '';
                var fontSizePixels = failures[i].fontSizePixels;
                var fontWeight = failures[i].fontWeight;
                var minLargeSize = failures[i].minLargeSize;
                var backgrounds = failures[i].backgrounds;

                // If the values would look identical, add decimals to the value.
                while (required === value) {
                    decimals++;
                    value = (Math.round(failures[i].value * Math.pow(10, decimals)) / Math.pow(10, decimals));
                }
                
                if (required === 4.5) {
                    var code = 'G18';
                } else if (required === 3.0) {
                    var code = 'G145';
                }

                var recommendText = [];
                if (recommend) {
                    if (recommend.fore.from !== recommend.fore.to) {
                        recommendText.push(_global.HTMLCS.getTranslation("1_4_3_G18_or_G145.Fail.Recomendation.Text") + ' ' + recommend.fore.to);
                    }
                    if (recommend.back.from !== recommend.back.to) {
                        recommendText.push(_global.HTMLCS.getTranslation("1_4_3_G18_or_G145.Fail.Recomendation.Background") + ' ' + recommend.back.to);
                    }
                }//end if

                if (recommendText.length > 0) {
                    recommendText = ' ' + _global.HTMLCS.getTranslation("1_4_3_G18_or_G145.Fail.Recomendation") + ' ' + recommendText.join(', ') + '.';
                }

                if (isAbsolute === true) {
                    code += '.Abs';
                    HTMLCS.addMessage(HTMLCS.WARNING, element, _global.HTMLCS.getTranslation("1_4_3_G18_or_G145.Abs").replace(/\{\{required\}\}/g, required), code, {
                      color: colour,
                      bgColor: bgColour,
                        backgrounds: backgrounds,
                      hasBgImage: hasBgImg,
                        bgRepeat: bgRepeat,
                        bgSize: bgSize,
                      fontSize: fontSize,
                      bgImg: bgImg,
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
                    HTMLCS.addMessage(HTMLCS.WARNING, element,  _global.HTMLCS.getTranslation("1_4_3_G18_or_G145.BgImage").replace(/\{\{required\}\}/g, required), code, {
                      color: colour,
                      bgColor: bgColour,
                        backgrounds: backgrounds,
                      hasBgImage: hasBgImg,
                        bgRepeat: bgRepeat,
                        bgSize: bgSize,
                      fontSize: fontSize,
                      bgImg: bgImg,
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
                    HTMLCS.addMessage(HTMLCS.ERROR, element, _global.HTMLCS.getTranslation("1_4_3_G18_or_G145.Fail").replace(/\{\{required\}\}/g, required).replace(/\{\{value\}\}/g, value) + recommendText, code, {
                      color: colour,
                      bgColor: bgColour,
                        backgrounds: backgrounds,
                      hasBgImage: hasBgImg,
                        bgRepeat: bgRepeat,
                        bgSize: bgSize,
                      fontSize: fontSize,
                      bgImg: bgImg,
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
