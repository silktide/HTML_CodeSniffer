/**
 * +--------------------------------------------------------------------+
 * | This HTML_CodeSniffer file is Copyright (c)                        |
 * | Squiz Australia Pty Ltd ABN 53 131 581 247                         |
 * +--------------------------------------------------------------------+
 * | IMPORTANT: Your use of this Software is subject to the terms of    |
 * | the Licence provided in the file licence.txt. If you cannot find   |
 * | this file please contact Squiz (www.squiz.com.au) so we may        |
 * | provide you a copy.                                                |
 * +--------------------------------------------------------------------+
 *
 */

_global.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_4_1_4_3_Contrast = {
    testContrastRatio: function (top, minContrast, minLargeContrast)
    {
        var startDate = new Date();
        var count     = 0;
        var xcount    = 0;
        var failures  = [];

        if (!top.ownerDocument) {
            var toProcess = [top.getElementsByTagName('body')[0]];
        } else {
            var toProcess = [top];
        }

        while (toProcess.length > 0) {
            var node = toProcess.shift();

            // This is an element.
            // Note we check for elements that are not _explicitly_ hidden, see isVisuallyHidden()
            if (node && (node.nodeType === 1) && (HTMLCS.util.isVisuallyHidden(node) === false) &&
                (HTMLCS.util.isHiddenText(node) === false) &&
                (HTMLCS.util.isDisabled(node) === false)) {
                var processNode = false;
                for (var i = 0; i < node.childNodes.length; i++) {
                    // Load up new nodes, but also only process this node when
                    // there are direct text elements.
                    if (node.childNodes[i].nodeType === 1) {
                        toProcess.push(node.childNodes[i]);
                    } else if (node.childNodes[i].nodeType === 3) {
                        if (HTMLCS.util.trim(node.childNodes[i].nodeValue) !== '') {
                            processNode = true;
                        }
                    }
                }

                if (processNode === true) {
                    var style = HTMLCS.util.style(node);

                    if (style) {
                        var bgColour = style.backgroundColor;
                        var bgImg = "";
                        var bgRepeat = "";
                        var bgSize = "";
                        var bgPosition = "";
                        var foreColour = style.color;
                        var bgElement = node;
                        var hasBgImg   = false;
                        var backgrounds = [];

                        // For compatibility with CS, we retain their name for this variable, but
                        // it now extends beyond just "absolute" to mean "is positioned outside of parent".
                        // Essentially it means we can't reliably know our background colour.
                        var isAbsolute = false;


                        if (style.backgroundImage !== 'none' && style.backgroundImage.startsWith('url')) {
                            hasBgImg = true;
                        }

                        if (style.position === 'absolute') {
                            isAbsolute = true;
                        }

                        // Calculate font size. Note that CSS 2.1 fixes a reference pixel
                        // as 96 dpi (hence "pixel ratio" workarounds for Hi-DPI devices)
                        // so this calculation should be safe.
                        var fontSize = parseFloat(style.fontSize, 10) * (72 / 96);
                        var fontSizePixels = parseInt(style.fontSize);
                        var fontWeight = parseInt(style.fontWeight);
                        var minLargeSize = 18;

                        // Exclude text with no font size, this is a common screen reader hack.
                        if (!fontSizePixels) {
                            continue;
                        }

                        if ((style.fontWeight === 'bold') || (parseInt(style.fontWeight, 10) >= 600)) {
                            minLargeSize = 14;
                        }

                        var reqRatio = fontSize >= minLargeSize ? minLargeContrast : minContrast;

                        var currentNode = node;
                        var currentStyle = style;

                        // Calculate our background colour(s) and image(s)
                        while (true) {
                            bgColour = currentStyle.backgroundColor;
                            if (HTMLCS.util.isColorFullyTransparent(bgColour)) {
                                bgColour = null;
                            }

                            var currentBgImg = currentStyle.backgroundImage ? this.getUrlFromStyle(currentStyle.backgroundImage) : '';

                            if (currentBgImg) {
                                hasBgImg = true;
                                bgImg = currentBgImg;
                                bgRepeat = currentStyle.backgroundRepeat;
                                bgSize = currentStyle.backgroundSize;
                                bgPosition = currentStyle.backgroundPosition;

                                backgrounds.push({
                                    tagName: currentNode.tagName,
                                    bgImg: bgImg,
                                    bgRepeat: bgRepeat,
                                    bgSize: bgSize,
                                    bgPosition: bgPosition,
                                    bgColor: bgColour,
                                    isAbsolute: HTMLCS.util.isPositionedOutsideParent(currentStyle)
                                });
                            } else if (bgColour) {
                                backgrounds.push({
                                    tagName: currentNode.tagName,
                                    bgColor: bgColour,
                                    isAbsolute: HTMLCS.util.isPositionedOutsideParent(currentStyle)
                                });

                                // Exit if the background is not even slightly transparent
                                if (!HTMLCS.util.isColorTransparent(bgColour)) {
                                    break;
                                }
                            }

                            if (HTMLCS.util.isPositionedOutsideParent(currentStyle)) {
                                isAbsolute = true;
                            }

                            // Up one node, if we can
                            currentNode = currentNode.parentNode;
                            if ((!currentNode) || (!currentNode.ownerDocument)) {
                                break;
                            }
                            currentStyle = HTMLCS.util.style(currentNode);
                        }

                        // Calculate the combined background colour from all of our
                        // relevant parents, by considering their alpha
                        bgColour = null;
                        for (var b = 0; b < backgrounds.length; b++) {
                            var thisBgColour = backgrounds[b].bgColor;
                            if (thisBgColour) {
                                if (!bgColour) {
                                    bgColour = thisBgColour;
                                } else {
                                    bgColour = HTMLCS.util.combineColors(bgColour, thisBgColour);
                                }
                            }
                        }

                        if (hasBgImg === true) {
                            // If we have a background image, skip the contrast ratio checks,
                            // and push a warning instead.
                            failures.push({
                                element: node,
                                colour: foreColour,
                                bgColour: bgColour,
                                backgrounds: backgrounds,
                                value: undefined,
                                required: reqRatio,
                                hasBgImage: true,
                                bgImg: bgImg,
                                bgRepeat: bgRepeat,
                                bgSize: bgSize,
                                bgPosition: bgPosition,
                                fontSize: fontSize,
                                fontSizePixels: fontSizePixels,
                                fontWeight: fontWeight,
                                minLargeSize: minLargeSize,
                            });
                            continue;
                        } else if (isAbsolute === true) {
                            failures.push({
                                element: node,
                                colour: foreColour,
                                bgColour: bgColour,
                                backgrounds: backgrounds,
                                value: undefined,
                                required: reqRatio,
                                isAbsolute: true,
                                fontSize: fontSize,
                                fontSizePixels: fontSizePixels,
                                fontWeight: fontWeight,
                                minLargeSize: minLargeSize,
                            });
                            continue;
                        } else if (!bgColour || (bgColour === 'transparent') || (bgColour === 'rgba(0, 0, 0, 0)'))  {
                            // If the background colour is still transparent, this is probably
                            // a fragment with which we cannot reliably make a statement about
                            // contrast ratio. Skip the element.
                            continue;
                        }

                        var contrastRatio = HTMLCS.util.contrastRatio(bgColour, style.color);
                        if (contrastRatio < reqRatio) {
                            var recommendation = this.recommendColour(bgColour, style.color, reqRatio);

                            failures.push({
                                element: node,
                                colour: style.color,
                                bgColour: bgColour,
                                backgrounds: backgrounds,
                                fontSize: fontSize,
                                bgPosition: bgPosition,
                                fontSizePixels: fontSizePixels,
                                fontWeight: fontWeight,
                                minLargeSize: minLargeSize,
                                value: contrastRatio,
                                required: reqRatio,
                                recommendation: recommendation
                            });
                        }//end if
                    }//end if
                }//end if
            }//end if
        }//end while

        return failures;
    },

    /**
     * Parse a string of format: url("foo") or similar
     *
     * @param style
     * @returns {*|string}
     */
    getUrlFromStyle: function(style) {
        if (style === 'none') {
            return '';
        }

        // Data URLs could be ridiculous, ignore them
        if (style.match(/^data:/i)) {
            return '';
        }
        // In format "url(...)"
        var matches=style.match(/url\(["']?([^"']*)["']?\)/);
        if (matches instanceof Array && matches.length>0) {
            return matches[1];
        }
        // Otherwise we could be a string like "linear-gradient(rgb(230, 100, 101), rgb(145, 152, 229))".
        // Return this so we can parse it.
        return style;
    },

    recommendColour: function(back, fore, target) {
        // Canonicalise the colours.
        var fore = HTMLCS.util.RGBtoColourStr(HTMLCS.util.colourStrToRGB(fore));
        var back = HTMLCS.util.RGBtoColourStr(HTMLCS.util.colourStrToRGB(back));

        var cr = HTMLCS.util.contrastRatio(fore, back);
        var foreDiff = Math.abs(HTMLCS.util.relativeLum(fore) - 0.5);
        var backDiff = Math.abs(HTMLCS.util.relativeLum(back) - 0.5);

        var recommendation = null;

        if (cr < target) {
            // Work out which colour has more room to move.
            // If they are the same, prefer changing the foreground colour.
            var multiplier = (1 + 1 / 400);
            if (foreDiff <= backDiff) {
                var change = 'back';
                var newCol = back;
                if (HTMLCS.util.relativeLum(back) < 0.5) {
                    var multiplier = (1 / multiplier);
                }
            } else {
                var change = 'fore';
                var newCol = fore;
                if (HTMLCS.util.relativeLum(fore) < 0.5) {
                    var multiplier = (1 / multiplier);
                }
            }

            var hsv     = HTMLCS.util.sRGBtoHSV(newCol);
            var chroma  = hsv.saturation * hsv.value;
            var newFore = fore;
            var newBack = back;
            var changed = false;

            var i = 0;

            while (cr < target) {
                if ((newCol === '#fff') || (newCol === '#000')) {
                    // Couldn't go far enough. Reset and try the other colour.
                    if (changed === true) {
                        // We've already switched colours, so we have to start
                        // winding back the other colour.
                        if (change === 'fore') {
                            var oldBack = newBack;
                            var j = 1;
                            while (newBack === oldBack) {
                                var newBack = this.multiplyColour(newBack, Math.pow(1 / multiplier, j));
                                j++;
                            }
                        } else {
                            var oldFore = newFore;
                            var j = 1;
                            while (newFore === oldFore) {
                                var newFore = this.multiplyColour(newFore, Math.pow(1 / multiplier, j));
                                j++;
                            }
                        }
                    } else {
                        newFore = fore;
                        newBack = back;
                        multiplier = 1 / multiplier;
                        if (change === 'fore') {
                            change = 'back';
                            var hsv = back;
                        } else {
                            change = 'fore';
                            var hsv = fore;
                        }

                        hsv     = HTMLCS.util.sRGBtoHSV(hsv);
                        chroma  = hsv.saturation * hsv.value;
                        changed = true;
                    }
                }

                i++;
                var newCol = HTMLCS.util.HSVtosRGB(hsv);
                var newCol = this.multiplyColour(newCol, Math.pow(multiplier, i));

                if (change === 'fore') {
                    var newFore = newCol;
                } else {
                    var newBack = newCol;
                }

                var cr = HTMLCS.util.contrastRatio(newFore, newBack);
            }//end while

            recommendation = {
                fore: {
                    from: fore,
                    to: newFore
                },
                back: {
                    from: back,
                    to: newBack
                }
            }
        }//end if

        return recommendation;
    },

    multiplyColour: function(colour, multiplier) {
        var hsvColour = HTMLCS.util.sRGBtoHSV(colour);
        var chroma    = hsvColour.saturation * hsvColour.value;

        // If we are starting from black, start it from #010101 instead.
        if (hsvColour.value === 0) {
            hsvColour.value = (1 / 255);
        }

        hsvColour.value = hsvColour.value * multiplier;
        if (hsvColour.value === 0) {
            hsvColour.saturation = 0;
        } else {
            hsvColour.saturation = chroma / hsvColour.value;
        }

        hsvColour.value      = Math.min(1, hsvColour.value);
        hsvColour.saturation = Math.min(1, hsvColour.saturation);

        var newColour = HTMLCS.util.RGBtoColourStr(HTMLCS.util.HSVtosRGB(hsvColour));
        return newColour;
    }
}
