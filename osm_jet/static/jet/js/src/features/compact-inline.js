var $ = require('jquery');

var CompactInline = function($inline) {
    this.$inline = $inline;
    this.prefix = $inline.data('inline-prefix');
    this.verboseName = $inline.data('inline-verbose-name');
    this.deleteText = $inline.data('inline-delete-text');
};

CompactInline.prototype = {
    updateLabels: function($inline) {
        var self = this;
        var $navigationItems = $inline.find('.inline-navigation-item');

        $inline.find('.inline-related').each(function(i) {
            var $inlineItem = $(this);
            var $label = $inlineItem.find('.inline_label');
            var label = $label.html().replace(/(#\d+)/g, "#" + (i + 1));
            var $navigationItem = $navigationItems.eq(i);
            var navigationLabel = $inlineItem.hasClass('has_original') ? label : self.verboseName + ' ' + label;

            $label.html(label);
            $navigationItem.html(navigationLabel);
        });
    },
    updateFormIndex: function($form, index) {
        var id_regex = new RegExp('(' + this.prefix + '-(\\d+|__prefix__))');
        var replacement = this.prefix + "-" + index;

        $form.find('*').each(function() {
            var $el = $(this);

            $.each(['for', 'id', 'name'], function() {
                var attr = this;

                if ($el.attr(attr)) {
                    $el.attr(attr, $el.attr(attr).replace(id_regex, replacement));
                }
            });
        });

        if (!$form.hasClass('empty-form')) {
            $form.attr('id', this.prefix + '-' + index);
        }
    },
    updateFormsIndexes: function($inline) {
        var self = this;
        var $navigationItems = $inline.find('.inline-navigation-item');

        $inline.find('.inline-related').each(function(i) {
            var $inlineItem = $(this);

            self.updateFormIndex($inlineItem, i);
            $navigationItems.eq(i).attr('data-inline-related-id', $inlineItem.attr('id'));
        });
    },
    updateTotalForms: function($inline) {
        var $totalFormsInput = $inline.find('[name="' + this.prefix + '-TOTAL_FORMS"]');
        var $maxFormsInput = $inline.find('[name="' + this.prefix + '-MAX_NUM_FORMS"]');
        var totalForms = parseInt($inline.find('.inline-related:not(.empty-form)').length);
        var maxForms = $maxFormsInput.val() ? parseInt($maxFormsInput.val()) : Infinity;

        $totalFormsInput.val(totalForms);
        $inline.find('.add-row').toggle(maxForms >= totalForms);
    },
    addNavigationItem: function($inline, $inlineItem) {
        var $empty = $inline.find('.inline-navigation-item.empty');

        return $empty
            .clone()
            .removeClass('empty')
            .attr('data-inline-related-id', $inlineItem.attr('id'))
            .insertBefore($empty);
    },
    openNavigationItem: function($inline, $item) {
        $inline
            .find('.inline-related')
            .removeClass('selected')
            .filter('#' + $item.attr('data-inline-related-id'))
            .addClass('selected');

        $inline.find('.inline-navigation-item').removeClass('selected');
        $item.addClass('selected');
    },
    removeItem: function($inline, $item) {
        $item.remove();
        $inline.find('.inline-navigation-item[data-inline-related-id="' + $item.attr('id') + '"]').remove();
    },
    openFirstNavigationItem: function($inline) {
        var $item = $inline.find('.inline-navigation-item:not(.empty)').first();

        if ($item == undefined) {
            return;
        }

        this.openNavigationItem($inline, $item);
        this.scrollNavigationToTop($inline);
    },
    addItemDeleteButton: function($item) {
        $item
            .children(':first')
            .append('<span><a class="inline-deletelink" href="#">' + this.deleteText + "</a></span>");
    },
    scrollNavigationToTop: function($inline) {
        var $navigationItemsContainer = $inline.find('.inline-navigation-content');

        $navigationItemsContainer.stop().animate({
            scrollTop: 0
        });
    },
    scrollNavigationToBottom: function($inline) {
        var $navigationItemsContainer = $inline.find('.inline-navigation-content');

        $navigationItemsContainer.stop().animate({
            scrollTop: $navigationItemsContainer.prop('scrollHeight')
        });
    },
    initAdding: function($inline) {
        var self = this;

        $inline.find('.add-row a').on('click', function (e) {
            e.preventDefault();

            var $empty = $inline.find('.inline-related.empty-form');
            var cloneIndex = parseInt($inline.find('.inline-related').length) - 1;
            var $clone = $empty
                .clone(true)
                .removeClass('empty-form')
                .insertBefore($empty);

            self.updateTotalForms($inline);
            self.updateFormIndex($clone, cloneIndex);
            self.updateFormIndex($empty, cloneIndex + 1);

            var navigationItem = self.addNavigationItem($inline, $clone);

            self.updateLabels($inline);
            self.openNavigationItem($inline, navigationItem);
            self.addItemDeleteButton($clone);
            self.scrollNavigationToBottom($inline);
        });
    },
    initDeletion: function($inline) {
        var self = this;

        $inline.on('click', '.inline-deletelink', function(e) {
            e.preventDefault();

            var $inlineItem = $(this).closest('.inline-related');

            self.removeItem($inline, $inlineItem);
            self.updateFormsIndexes($inline);
            self.updateLabels($inline);
            self.updateTotalForms($inline);
            self.openFirstNavigationItem($inline);
        });

        $inline.find('.inline-related').each(function() {
            var $inlineItem = $(this);

            $inlineItem.find('.delete input').on('change', function() {
                $inline
                    .find('.inline-navigation-item[data-inline-related-id="' + $inlineItem.attr('id') + '"]')
                    .toggleClass('delete', $(this).is(':checked'));
            });
        });
    },
    initNavigation: function($inline) {
        var self = this;

        $inline.on('click', '.inline-navigation-item', function(e) {
            e.preventDefault();

            self.openNavigationItem($inline, $(this));
        });

        self.openFirstNavigationItem($inline);
    },
    run: function() {
        var $inline = this.$inline;

        try {
            this.initAdding($inline);
            this.initDeletion($inline);
            this.initNavigation($inline);
        } catch (e) {
            console.error(e, e.stack);
        }
    }
};

/* eslint-disable no-var, object-shorthand, prefer-template */
class SortableInline {
  constructor ({ el }) {
    this.el = el
    this.navigationContent = el.querySelector('.inline-navigation-content')
    this.sortableItems = Array.from(el.querySelectorAll('.inline-navigation-item:not(.empty)')).map(el => new SortableItem({ el }))
    this.emptyItem = el.querySelector('.inline-related.empty-form')
    this.emptyItemInputs = this.emptyItem.querySelectorAll('input, textarea, select')

    this.addAnother = this.el.querySelector('.add-row a')
    this.inlineDeleteLinks = this.el.querySelectorAll('.inline-deletelink')

    this.setupListeners()
    this.createHandles()
    initWYSIWYG()

    Sortable.create(el.querySelector('.inline-navigation-items'), {
      animation: 100,
      forceFallback: true,
      onStart: this.onStart.bind(this),
      onEnd: this.onEnd.bind(this)
    }) // eslint-disable-line no-undef
  }

  setupListeners () {
    const handleCallback = this.createHandles.bind(this)
    this.addAnother.addEventListener('click', () => {
      this.sortableItems = Array.from(this.el.querySelectorAll('.inline-navigation-item:not(.empty)')).map(el => new SortableItem({ el }))

      this.createHandles()
      this.inlineDeleteLinks = this.el.querySelectorAll('.inline-deletelink')

      for (const link of this.inlineDeleteLinks) {
        link.removeEventListener('click', handleCallback)
        link.addEventListener('click', handleCallback)
      }
      initWYSIWYG()
    })
  }

  onStart (evt, originalEvent) {
    this.navigationContent.classList.add('dragging')
  }

  onEnd (evt, originalEvent) {
    this.navigationContent.classList.remove('dragging')
    this.updateOrder()
  }

  updateOrder () {
    let i = 0
    this.sortableItems = Array.from(this.el.querySelectorAll('.inline-navigation-item:not(.empty)')).map(el => new SortableItem({ el }))
    this.emptyItem = this.el.querySelector('.inline-related.empty-form')
    this.emptyItemInputs = this.emptyItem.querySelectorAll('input, textarea, select')

    for (const item of this.sortableItems) {
      i++
      let matchCount = 0
      for (let j = 0; j < this.emptyItemInputs.length; j++) {
        if (this.emptyItemInputs[j].value !== item.relatedInputs[j].value) {
          // If there's a value which isn't the same break straight away, we will save this one
          break
        }
        // If the value is the same as the default add to the match count
        matchCount++
      }

      if (matchCount !== this.emptyItemInputs.length) {
        // There must be some deviation from the default values so update the order
        item.relatedSection.querySelector('.field-order input').value = i
      }
    }
  }

  createHandles () {
    window.requestAnimationFrame(() => {
      for (const item of this.sortableItems) {
        item.createHandle()
      }
    })
  }
}

class SortableItem {
  constructor ({ el }) {
    this.el = el
    this.relatedSection = document.getElementById(this.el.dataset.inlineRelatedId)
    this.relatedInputs = this.relatedSection.querySelectorAll('input, textarea, select')
  }

  createHandle () {
    this.el.removeAttribute('href')

    var handle = document.createElement('span')
    var handleText = document.createTextNode('☰')
    handle.appendChild(handleText)
    handle.classList.add('drag-handle')
    this.el.insertAdjacentElement('afterbegin', handle)
  }
}

/**
 * Clearly indicate the section that has an error on it.
 * Interate over all the sections and if it has an error, add a class to that sections sidebar item.
 */
function highlightErrors () {
  var sectionTabs = document.querySelectorAll('.inline-navigation-item:not(.empty)')
  for (var i = 0; i < sectionTabs.length; i++) {
    var section = document.getElementById(sectionTabs[i].dataset.inlineRelatedId)
    if (section.querySelector('.errorlist')) {
      sectionTabs[i].classList.add('section-error')
    }
  }
}

/**
 * If there are any WYSIWYG editors in the inline, we initialise them here. We only initialise on the
 * visible (not on the hidden form) ones due to how the inline works means they break if we also
 * initalise the hidden form's editor.
 */
function initWYSIWYG () {
  var WYSIWYGEditors = document.querySelectorAll('.inline-related:not(.empty-form) .wysiwyg')
  for (var i = 0; i < WYSIWYGEditors.length; i++) {
    // This function is provided by the OSM CMS's utils.js
    window.activate_tinymce(WYSIWYGEditors[i])
  }
}

document.addEventListener('DOMContentLoaded', function () {
  let sortables = Array.from(document.querySelectorAll('.inline-group')).map(el => new SortableInline({ el }))
  highlightErrors()

  // Code to run when the form is submitted
  var contentForm = document.querySelector('#content-main form')
  contentForm.addEventListener('submit', () => {
    for (const sortable of sortables) {
      sortable.updateOrder()
    }
  })
})
/* eslint-enable no-var, object-shorthand, prefer-template */


module.exports = CompactInline;
