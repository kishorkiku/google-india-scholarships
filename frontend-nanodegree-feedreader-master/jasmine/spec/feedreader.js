/*
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
    /* This is the first test suite - a test suite just contains
    * a related set of tests. This suite is all about the RSS
    * feeds definitions, the allFeeds variable in our application.
    */
    describe('RSS Feeds', function() {

        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        /* the test that loops through each feed
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
         */
         it('has URL defined and it is not empty', function(){
            var len =allFeeds.length;
            for(var i = 0; i<len; i++){
                expect(allFeeds[i].url.length).not.toBe(0);//ensures it has a URL is not empty.
                expect(allFeeds[i].url).toBeDefined();//ensures it has a URL defined
            }
         });

        /* this test that loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
         */
         it('has name defined and it is not empty', function(){
            var len =allFeeds.length;
            for(var i = 0; i<len; i++){
                expect(allFeeds[i].name.length).not.toBe(0);//ensures it has a name is not empty.
                expect(allFeeds[i].name).toBeDefined();//ensures it has a name defined
            }
         });
    });


    /*new test suite named "The menu" */
    describe('The menu', function(){
        /* test that ensures the menu element is
         * hidden by default. You'll have to analyze the HTML and
         * the CSS to determine how we're performing the
         * hiding/showing of the menu element.
         */

        /* The menu elements visibility is toggled by removing and adding
         *the class 'menu-hidden'.
         */
         it('element is hidden by default', function(){
            expect($(document.body).hasClass('menu-hidden')).not.toBe(false);
         });

         /* test that ensures the menu changes
          * visibility when the menu icon is clicked. This test
          * should have two expectations: does the menu display when
          * clicked and does it hide when clicked again.
          */
          it('element is shown when icon is clicked', function(){
            expect($(document.body).hasClass('menu-hidden')).not.toBe(false);
            $('a.menu-icon-link').click();
            expect($(document.body).hasClass('menu-hidden')).toBe(false);
          });
          it('element is hidden when icon is clicked again', function(){
            expect($(document.body).hasClass('menu-hidden')).toBe(false);
            $('a.menu-icon-link').click();
            expect($(document.body).hasClass('menu-hidden')).not.toBe(false);
          });
    });


    /*new test suite named "Initial Entries" */
    describe('Initial Entries', function(){
        /* Ensures when the loadFeed function is
         * called and completes its work, there is at least
         * a single .entry element within the .feed container.
         * loadFeed() is asynchronous so this test will require
         * the use of Jasmine's beforeEach and asynchronous done() function.
         */
         beforeEach(function(done){
            loadFeed(0, done);
         });

        it('there is at least a single .entry element within the .feed container', function(){
            expect($('.feed .entry').length).not.toBe(0);
        });
    });

    /* A new test suite named "New Feed Selection"*/
    describe('New Feed Selection', function(){
        /* A test that ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         * Remember, loadFeed() is asynchronous.
         */
        var initialContent;

        beforeEach(function(done){
            loadFeed(0, function(){
                initialContent = $('.feed').html();
                done();//signals the completion of loadFeed() funtion
            });
         });

        it('content changes when a new feed is loaded', function(done){
            loadFeed(1, function(){
                expect($('.feed').html()).not.toBe(initialContent);//checking the content actually changes
                done();
            });
        });
    });

}());




