const $ = require('jquery');
const WindowStorage = require('../utils/window-storage');

const RelatedPopups = function() {
    this.windowStorage = new WindowStorage('relatedWindows');
};

RelatedPopups.prototype = {
    updateLinks ($select) {
        $select.find('~ .change-related, ~ .delete-related, ~ .add-another').each(function() {
            const $link = $(this);
            const hrefTemplate = $link.data('href-template');

            if (hrefTemplate === undefined) {
                return;
            }

            const value = $select.val();

            if (value) {
                $link.attr('href', hrefTemplate.replace('__fk__', value))
            } else {
                $link.removeAttr('href');
            }
        });
    },
    initLinksForRow ($row) {
        if ($row.data('related-popups-links-initialized')) {
            return;
        }

        const self = this;

        $row.find('select, .sortedm2m-container, > .sortedm2m-item-label').each(function() {
            const $select = $(this);

            self.updateLinks($select);

            $select.find('~ .add-related, ~ .change-related, ~ .delete-related, ~ .add-another').each(function() {
                const $link = $(this);

                $link.on('click', function(e) {
                    e.preventDefault();

                    let href = $link.attr('href');

                    if (href !== undefined) {
                        if (href.indexOf('_popup') === -1) {
                            href += (href.indexOf('?') === -1) ? '?_popup=1' : '&_popup=1';
                        }

                        self.showPopup($select, href);
                    }
                });
            });
        }).on('change', function() {
            self.updateLinks($(this));
        });

        $row.find('input').each(function() {
            const $input = $(this);

            $input.find('~ .related-lookup').each(function() {
                const $link = $(this);

                $link.on('click', function(e) {
                    e.preventDefault();

                    let href = $link.attr('href');

                    href += (href.indexOf('?') === -1) ? '?_popup=1' : '&_popup=1';

                    self.showPopup($input, href);
                });
            });
        });

        $row.data('related-popups-links-initialized', true);
    },
    initLinks () {
        const self = this;

        $('.form-row:not(.empty-form .form-row)').each(function() {
            self.initLinksForRow($(this));
        });

        $('.inline-group').on('inline-group-row:added', function(e, $inlineItem) {
            $inlineItem.find('.form-row').each(function() {
                self.initLinksForRow($(this));
            });
        });
    },
    initPopupBackButton () {
        const self = this;

        $('.related-popup-back').on('click', function(e) {
            e.preventDefault();
            self.closePopup();
        });
    },
    showPopup ($input, href) {
        const $document = $(window.top.document);
        const $container = $document.find('.related-popup-container');
        const $loading = $container.find('.loading-indicator');
        const $body = $document.find('body');
        const $popup = $('<div>')
            .addClass('related-popup')
            .data('input', $input);
            const $iframe = $('<iframe>')
            .attr('src', href)
            .on('load', function() {
                $popup.add($document.find('.related-popup-back')).fadeIn(200, 'swing', function() {
                    $loading.hide();
                });
            });

        $popup.append($iframe);
        $loading.show();
        $document.find('.related-popup').add($document.find('.related-popup-back')).fadeOut(200, 'swing');
        $container.fadeIn(200, 'swing', function() {
            $container.append($popup);
        });
        $body.addClass('non-scrollable');
    },
    closePopup (response) {
        const previousWindow = this.windowStorage.previous();
        const self = this;

        (function($) {
            const $document = $(window.top.document);
            const $popups = $document.find('.related-popup');
            const $container = $document.find('.related-popup-container');
            const $popup = $popups.last();

            if (response !== undefined) {
                self.processPopupResponse($popup, response);
            }

            self.windowStorage.pop();

            if ($popups.length === 1) {
                $container.fadeOut(200, 'swing', function() {
                    $document.find('.related-popup-back').hide();
                    $document.find('body').removeClass('non-scrollable');
                    $popup.remove();
                });
            } else if ($popups.length > 1) {
                $popup.remove();
                $popups.eq($popups.length - 2).show();
            }
        })(previousWindow ? previousWindow.jet.jQuery : $);
    },
    findPopupResponse () {
        const self = this;

        $('#django-admin-popup-response-constants').each(function() {
            const $constants = $(this);
            const response = $constants.data('popup-response');

            self.closePopup(response);
        });
    },
    processPopupResponse ($popup, response) {
        const $input = $popup.data('input');

        switch (response.action) {
            case 'change':
                if ($input.is('label.sortedm2m-item-label')) {
                    $input.find('.sortedm2m-item-name').html(response.obj);
                } else {
                    $input.find('option').each(function() {
                        const $option = $(this);

                        if ($option.val() === response.value) {
                            $option.html(response.obj).val(response.new_value);
                        }
                    });
                }

                $input.trigger('change').trigger('select:init');

                break;
            case 'delete':
                $input.find('option').each(function() {
                    const $option = $(this);

                    if ($option.val() === response.value) {
                        $option.remove();
                    }
                });

                $input.trigger('change').trigger('select:init');

                break;
            default:
                if ($input.is('select')) {
                    const $option = $('<option>')
                        .val(response.value)
                        .html(response.obj);

                    $input.append($option);
                    $option.attr('selected', true);

                    $input
                        .trigger('change')
                        .trigger('select:init');
                } else if ($input.is('input.vManyToManyRawIdAdminField') && $input.val()) {
                    $input.val(`${$input.val()},${response.value}`);
                } else if ($input.is('input')) {
                    $input.val(response.value);
                } else if ($input.is('div.sortedm2m-container')) {
                    const container = $input[0].querySelector('.sortedm2m-items')
                    const items = container.querySelectorAll('.sortedm2m-item')
                    const hiddenInput = $input[0].querySelector('input[type="hidden"]')
                    let value = hiddenInput.getAttribute('value')

                    if (value) {
                      value = `${response.value},${value}`
                    } else {
                      value = response.value
                    }

                    hiddenInput.setAttribute('value', value)

                    const newItem = document.createElement('li')
                    newItem.classList.add('sortedm2m-item')

                    const label = document.createElement('label')
                    const labelText = document.createTextNode(` ${response.obj}`)
                    label.setAttribute('for', `id_items_${items.length}`)

                    const input = document.createElement('input')
                    input.setAttribute('type', 'checkbox')
                    input.setAttribute('value', `${response.value}`)
                    input.setAttribute('id', `id_items_${items.length}`)
                    input.setAttribute('checked', '')
                    input.classList.add('sortedm2m')

                    let referenceNode = null

                    if (items.length) {
                      referenceNode = items[0]
                    }

                    container.insertBefore(newItem, referenceNode)
                    newItem.appendChild(label)
                    label.appendChild(input)
                    label.appendChild(labelText)
                }

                break;
        }
    },
    overrideRelatedGlobals () {
        const self = this;

        window.showRelatedObjectLookupPopup
            = window.showAddAnotherPopup
            = window.showRelatedObjectPopup
            = function() { };

        window.opener = this.windowStorage.previous() || window.opener;
        window.dismissRelatedLookupPopup = function(win, chosenId) {
            self.closePopup({
                action: 'lookup',
                value: chosenId
            });
        };
    },
    initDeleteRelatedCancellation () {
        const self = this;

        $('.popup.delete-confirmation .cancel-link').on('click', function(e) {
            e.preventDefault();
            self.closePopup();
        }).removeAttr('onclick');
    },
    initLookupLinks () {
        const self = this;

        $("a[data-popup-opener]").click(function(e) {
            e.preventDefault();

            self.closePopup({
                action: 'lookup',
                value: $(this).data("popup-opener")
            });
        });
    },
    run () {
        this.windowStorage.push(window);

        this.initLinks();
        this.initPopupBackButton();
        this.findPopupResponse();
        this.overrideRelatedGlobals();
        this.initDeleteRelatedCancellation();
        this.initLookupLinks();
    }
};

$(document).ready(function() {
    /*
     *  JET js assumes the add another button will have the same parent as the select element
     *  so we have to move the button for DjangoM2Ms to be next to the 'new' select element
     */
    const djangoM2M = document.querySelectorAll('.js-DjangoM2MContainer')
    for (const el of djangoM2M) {
        const newContainer = el.querySelector('.js-SelectMultiple_New')
        const link = el.nextElementSibling
        newContainer.appendChild(link)
    }
    new RelatedPopups().run();
});
