angular.module('bishomen.directives', [])
        .directive('ksSwiperContainer', SwiperContainer)
        .directive('ksSwiperSlide', SwiperSlide)
        .directive('flexSlider', [
    '$parse', '$timeout', function($parse, $timeout) {
      return {
        restrict: 'AE',
        scope: false,
        replace: true,
        transclude: true,
        template: '<div class="flexslider-container"></div>',
        compile: function(element, attr, linker) {
          return function($scope, $element) {
            var addSlide, collectionString, flexsliderDiv, getTrackFromItem, indexString, match, removeSlide, slidesItems, trackBy;
            match = (attr.slide || attr.flexSlide).match(/^\s*(.+)\s+in\s+(.*?)(?:\s+track\s+by\s+(.+?))?\s*$/);
            indexString = match[1];
            collectionString = match[2];
            trackBy = angular.isDefined(match[3]) ? $parse(match[3]) : $parse("" + indexString);
            flexsliderDiv = null;
            slidesItems = {};
            getTrackFromItem = function(collectionItem, index) {
              var locals;
              locals = {};
              locals[indexString] = collectionItem;
              locals['$index'] = index;
              return trackBy($scope, locals);
            };
            addSlide = function(collectionItem, index, callback) {
              var childScope, track;
              track = getTrackFromItem(collectionItem, index);
              if (slidesItems[track] != null) {
                throw "Duplicates in a repeater are not allowed. Use 'track by' expression to specify unique keys.";
              }
              childScope = $scope.$new();
              childScope[indexString] = collectionItem;
              childScope['$index'] = index;
              return linker(childScope, function(clone) {
                var slideItem;
                slideItem = {
                  collectionItem: collectionItem,
                  childScope: childScope,
                  element: clone
                };
                slidesItems[track] = slideItem;
                return typeof callback === "function" ? callback(slideItem) : void 0;
              });
            };
            removeSlide = function(collectionItem, index) {
              var slideItem, track;
              track = getTrackFromItem(collectionItem, index);
              slideItem = slidesItems[track];
              if (slideItem == null) {
                return;
              }
              delete slidesItems[track];
              slideItem.childScope.$destroy();
              return slideItem;
            };
            return $scope.$watchCollection(collectionString, function(collection, oldCollection) {
              var attrKey, attrVal, c, currentSlidesLength, e, i, idx, n, options, slider, slides, t, toAdd, toRemove, trackCollection, _i, _j, _k, _l, _len, _len1, _len2, _len3;
              if (!(collection != null ? collection.length : void 0) && !(oldCollection != null ? oldCollection.length : void 0)) {
                return;
              }
              if (flexsliderDiv != null) {
                slider = flexsliderDiv.data('flexslider');
                currentSlidesLength = Object.keys(slidesItems).length;
                if (collection == null) {
                  collection = [];
                }
                trackCollection = {};
                for (i = _i = 0, _len = collection.length; _i < _len; i = ++_i) {
                  c = collection[i];
                  trackCollection[getTrackFromItem(c, i)] = c;
                }
                toAdd = (function() {
                  var _j, _len1, _results;
                  _results = [];
                  for (i = _j = 0, _len1 = collection.length; _j < _len1; i = ++_j) {
                    c = collection[i];
                    if (slidesItems[getTrackFromItem(c, i)] == null) {
                      _results.push({
                        value: c,
                        index: i
                      });
                    }
                  }
                  return _results;
                })();
                toRemove = (function() {
                  var _results;
                  _results = [];
                  for (t in slidesItems) {
                    i = slidesItems[t];
                    if (trackCollection[t] == null) {
                      _results.push(i.collectionItem);
                    }
                  }
                  return _results;
                })();
                if ((toAdd.length === 1 && toRemove.length === 0) || toAdd.length === 0) {
                  for (_j = 0, _len1 = toRemove.length; _j < _len1; _j++) {
                    e = toRemove[_j];
                    e = removeSlide(e, collection.indexOf(e));
                    slider.removeSlide(e.element);
                  }
                  for (_k = 0, _len2 = toAdd.length; _k < _len2; _k++) {
                    e = toAdd[_k];
                    idx = e.index;
                    addSlide(e.value, idx, function(item) {
                      if (idx === currentSlidesLength) {
                        idx = void 0;
                      }
                      return $scope.$evalAsync(function() {
                        return slider.addSlide(item.element, idx);
                      });
                    });
                  }
                  return;
                }
              }
              slidesItems = {};
              if (flexsliderDiv != null) {
                flexsliderDiv.remove();
              }
              slides = angular.element('<ul class="slides"></ul>');
              flexsliderDiv = angular.element('<div class="flexslider"></div>');
              flexsliderDiv.append(slides);
              $element.append(flexsliderDiv);
              for (i = _l = 0, _len3 = collection.length; _l < _len3; i = ++_l) {
                c = collection[i];
                addSlide(c, i, function(item) {
                  return slides.append(item.element);
                });
              }
              options = {};
              for (attrKey in attr) {
                attrVal = attr[attrKey];
                if (attrKey.indexOf('$') === 0) {
                  continue;
                }
                if (!isNaN(n = parseInt(attrVal))) {
                  options[attrKey] = n;
                  continue;
                }
                if (attrVal === 'false' || attrVal === 'true') {
                  options[attrKey] = attrVal === 'true';
                  continue;
                }
                if (attrKey === 'start' || attrKey === 'before' || attrKey === 'after' || attrKey === 'end' || attrKey === 'added' || attrKey === 'removed') {
                  options[attrKey] = (function(attrVal) {
                    var f;
                    f = $parse(attrVal);
                    return function(slider) {
                      return $scope.$apply(function() {
                        return f($scope, {
                          '$slider': {
                            element: slider
                          }
                        });
                      });
                    };
                  })(attrVal);
                  continue;
                }
                if (attrKey === 'startAt') {
                  options[attrKey] = $parse(attrVal)($scope);
                  continue;
                }
                options[attrKey] = attrVal;
              }
              if (!options.sliderId && attr.id) {
                options.sliderId = "" + attr.id + "-slider";
              }
              if (options.sliderId) {
                flexsliderDiv.attr('id', options.sliderId);
              }
              return $timeout((function() {
                return flexsliderDiv.flexslider(options);
              }), 0);
            });
          };
        }
      };
    }
  ]);

    function createUUID() {
        // http://www.ietf.org/rfc/rfc4122.txt
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }

    /* @ngInject */
    function SwiperContainer($log) {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                onReady: '&',
                slidesPerView: '=',
                slidesPerColumn: '=',
                spaceBetween: '=',
                parallax: '=',
                parallaxTransition: '@',
                paginationIsActive: '=',
                paginationClickable: '=',
                showNavButtons: '=',
                loop: '=',
                autoplay: '=',
                initialSlide: '=',
                containerCls: '@',
                paginationCls: '@',
                slideCls: '@',
                direction: '@',
                swiper: '=',
                overrideParameters: '='
            },
            controller: function($scope, $element) {

                this.buildSwiper = function() {

                    // directive defaults
                    var params = {
                        slidesPerView: $scope.slidesPerView || 1,
                        slidesPerColumn: $scope.slidesPerColumn || 1,
                        spaceBetween: $scope.spaceBetween || 0,
                        direction: $scope.direction || 'horizontal',
                        loop: $scope.loop || false,
                        initialSlide: $scope.initialSlide || 0,
                        showNavButtons: false
                    };

                    if($scope.autoplay === true){
                        params = angular.extend({}, params, {
                            autoplay: true
                        });
                    }

                    if($scope.paginationIsActive === true){
                        params = angular.extend({}, params, {
                            paginationClickable: $scope.paginationClickable || true,
                            pagination: '#paginator-' + $scope.swiper_uuid
                        });
                    }

                    if ($scope.showNavButtons === true) {
                        params.nextButton = '#nextButton-' + $scope.swiper_uuid;
                        params.prevButton = '#prevButton-' + $scope.swiper_uuid;
                    }

                    if($scope.overrideParameters){
                        params = angular.extend({}, params, $scope.overrideParameters);
                    }

                    var containerCls = $scope.containerCls || '';
                    
                    var swiper;

                    if(angular.isObject($scope.swiper)){
                        $scope.swiper = new Swiper($element[0].firstChild, params);
                        swiper = $scope.swiper;
                    }
                    else {
                        swiper = new Swiper($element[0].firstChild, params);
                    }
                    
                    //If specified, calls this function when the swiper object is available
                    if ($scope.onReady !== undefined)
                        $scope.onReady({ swiper: swiper });
                };
            },

            link: function(scope, element, attrs) {

                var uuid = createUUID();

                scope.swiper_uuid = uuid;

                var paginatorId = "paginator-" + uuid;
                var prevButtonId = "prevButton-" + uuid;
                var nextButtonId = "nextButton-" + uuid;

                angular.element(element[0].querySelector('.swiper-pagination'))
                    .attr('id', paginatorId);

                angular.element(element[0].querySelector('.swiper-button-next'))
                    .attr('id', nextButtonId);

                angular.element(element[0].querySelector('.swiper-button-prev'))
                    .attr('id', prevButtonId);
            },

            template: '<div class="swiper-container {{containerCls}}"><div class="parallax-bg" data-swiper-parallax="{{parallaxTransition}}" ng-show="parallax"></div><div class="swiper-wrapper" ng-transclude></div><div class="swiper-pagination {{paginationCls}}"></div><div class="swiper-button-next" ng-show="showNavButtons"></div><div class="swiper-button-prev" ng-show="showNavButtons"></div></div>'
        }
    }

    /* @ngInject */
    function SwiperSlide($timeout) {
        return {
            restrict: 'E',
            require: '^ksSwiperContainer',
            transclude: true,
            template: '<div ng-transclude></div>',
            replace: true,
            link: function(scope, element, attrs, containerController) {
                if (scope.$last === true) {
                    $timeout(function() {
                        containerController.buildSwiper();
                    }, 0);
                }
            }
        }
    }

    


