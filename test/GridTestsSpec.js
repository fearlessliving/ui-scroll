/*global describe, beforeEach, module, it, expect, runGridTest */
describe('uiScroll', function () {
	'use strict';

	beforeEach(module('ui.scroll'));
	beforeEach(module('ui.scroll.grid'));
	beforeEach(module('ui.scroll.test.datasources'));

	var scrollSettings = {
		datasource: 'myGridDatasource',
		viewportHeight: 120,
		itemHeight: 20,
		bufferSize: 3
	};

	function expectLayoutMap(scope, map) {
		var layout = scope.adapter.gridAdapter.getLayout();
		layout.forEach((column, index) => expect(column.mapTo).toBe(map[index]));
	}

	function getHeaderElement(head, index) {
		var header = head.children();
		return header.children()[index];
	}

	function getLastRowElement(body, index) {
		var rows = body.children();
		var lastRow = angular.element(rows[rows.length - 2]);
		return lastRow.children()[index];
	}


	describe('basic setup', function () {
		var scrollSettings = {datasource: 'myEmptyDatasource'};

		it('should create gridAdapter', function () {
			runGridTest(scrollSettings,
				function (head, body, scope) {
					expect(scope.adapter).toBeTruthy();
					expect(scope.adapter.gridAdapter).toBeTruthy();
					expect(Object.prototype.toString.call(scope.adapter.gridAdapter.getLayout()), '[object Array]');
				}
			);
		});

		it('columns should have default mapping', function () {
			runGridTest(scrollSettings,
				function (head, body, scope) {
					expectLayoutMap(scope, [0, 1, 2, 3]);
				}
			);
		});
	});


	describe('moveBefore method logic', function () {
		var scrollSettings = {datasource: 'myEmptyDatasource'};

		it('column mappings should not be affected by 0 -> 0 move', function () {
			runGridTest(scrollSettings,
				function (head, body, scope) {
					scope.adapter.gridAdapter.columns[0].moveBefore(0);
					expectLayoutMap(scope, [0, 1, 2, 3]);
				}
			);
		});

		it('column mappings should not be affected by 1 -> 1 move', function () {
			runGridTest(scrollSettings,
				function (head, body, scope) {
					scope.adapter.gridAdapter.columns[1].moveBefore(1);
					expectLayoutMap(scope, [0, 1, 2, 3]);
				}
			);
		});

		it('column mappings should not be affected by 3 -> 3 move', function () {
			runGridTest(scrollSettings,
				function (head, body, scope) {
					scope.adapter.gridAdapter.columns[3].moveBefore(3);
					expectLayoutMap(scope, [0, 1, 2, 3]);
				}
			);
		});

		it('column mappings should reflect 1 -> 0 move', function () {
			runGridTest(scrollSettings,
				function (head, body, scope) {
					scope.adapter.gridAdapter.columns[1].moveBefore(0);
					expectLayoutMap(scope, [1, 0, 2, 3]);
				}
			);
		});

		it('column mappings should reflect 3 -> 0 move', function () {
			runGridTest(scrollSettings,
				function (head, body, scope) {
					scope.adapter.gridAdapter.columns[3].moveBefore(0);
					expectLayoutMap(scope, [1, 2, 3, 0]);
				}
			);
		});

		it('column mappings should reflect 2 -> 1 move', function () {
			runGridTest(scrollSettings,
				function (head, body, scope) {
					scope.adapter.gridAdapter.columns[2].moveBefore(1);
					expectLayoutMap(scope, [0, 2, 1, 3]);
				}
			);
		});

		it('column mappings should reflect 0 -> 1 move (it is a noop)', function () {
			runGridTest(scrollSettings,
				function (head, body, scope) {
					scope.adapter.gridAdapter.columns[0].moveBefore(1);
					expectLayoutMap(scope, [0, 1, 2, 3]);
				}
			);
		});

		it('column mappings should reflect 2 -> 2 move (it is a noop)', function () {
			runGridTest(scrollSettings,
				function (head, body, scope) {
					scope.adapter.gridAdapter.columns[2].moveBefore(2);
					expectLayoutMap(scope, [0, 1, 2, 3]);
				}
			);
		});

		it('column mappings should reflect 0 -> 2 move', function () {
			runGridTest(scrollSettings,
				function (head, body, scope) {
					scope.adapter.gridAdapter.columns[0].moveBefore(2);
					expectLayoutMap(scope, [1, 0, 2, 3]);
				}
			);
		});

		it('column mappings should reflect 0 -> 4 move', function () {
			runGridTest(scrollSettings,
				function (head, body, scope) {
					scope.adapter.gridAdapter.columns[0].moveBefore(4);
					expectLayoutMap(scope, [3, 0, 1, 2]);
				}
			);
		});

		it(' 1 -> 0 move twice should be a noop', function () {
			runGridTest(scrollSettings,
				function (head, body, scope) {
					scope.adapter.gridAdapter.columns[1].moveBefore(0);
					expectLayoutMap(scope, [1, 0, 2, 3]);

					scope.adapter.gridAdapter.columns[1].moveBefore(0);
					expectLayoutMap(scope, [0, 1, 2, 3]);
				}
			);
		});

		it('multiple moveBefore should work', function () {
			runGridTest(scrollSettings,
				function (head, body, scope) {
					expectLayoutMap(scope, [0, 1, 2, 3]);

					scope.adapter.gridAdapter.columns[2].moveBefore(1);
					expectLayoutMap(scope, [0, 2, 1, 3]);

					scope.adapter.gridAdapter.columns[3].moveBefore(0);
					expectLayoutMap(scope, [1, 3, 2, 0]);

					scope.adapter.gridAdapter.columns[3].moveBefore(2);
					expectLayoutMap(scope, [1, 2, 3, 0]);

					scope.adapter.gridAdapter.columns[1].moveBefore(3);
					expectLayoutMap(scope, [2, 1, 3, 0]);
				}
			);
		});
	});


	describe('moveBefore method', function () {
		it('should reorder headers', function () {
			runGridTest(scrollSettings,
				function (head, body, scope) {
					var _head1 = getHeaderElement(head, 1).innerHTML;
					var _head2 = getHeaderElement(head, 2).innerHTML;

					scope.adapter.gridAdapter.columns[2].moveBefore(1);

					var head1 = getHeaderElement(head, 1).innerHTML;
					var head2 = getHeaderElement(head, 2).innerHTML;

					expect(head1).toBe(_head2);
					expect(head2).toBe(_head1);
				}
			);
		});

		it('should reorder body columns', function () {
			runGridTest(scrollSettings,
				function (head, body, scope) {
					var _body1 = getLastRowElement(body, 1).innerHTML;
					var _body2 = getLastRowElement(body, 2).innerHTML;

					scope.adapter.gridAdapter.columns[2].moveBefore(1);

					var body1 = getLastRowElement(body, 1).innerHTML;
					var body2 = getLastRowElement(body, 2).innerHTML;

					expect(body1).toBe(_body2);
					expect(body2).toBe(_body1);
				}
			);
		});

		it('should reorder body columns after new rows rendering', function () {
			runGridTest(scrollSettings,
				function (head, body, scope, $timeout) {
					var _body1 = getLastRowElement(body, 1).innerHTML;
					var _body2 = getLastRowElement(body, 2).innerHTML;

					scope.adapter.gridAdapter.columns[2].moveBefore(1);

					body.scrollTop(1000);
					body.trigger('scroll');
					$timeout.flush();

					var body1 = getLastRowElement(body, 1).innerHTML;
					var body2 = getLastRowElement(body, 2).innerHTML;

					expect(_body1.indexOf('item')).toBe(0);
					expect(_body2).toBe('');
					expect(body1).toBe('');
					expect(body2.indexOf('item')).toBe(0);
				}
			);
		});
	});


	describe('css method', function () {
		var attr = 'backgroundColor', value = 'yellow';

		it('should apply css right after the call', function () {
			runGridTest(scrollSettings,
				function (head, body, scope) {

					var headerElement = getHeaderElement(head, 0);
					var lastRowElement = getLastRowElement(body, 0);
					expect(headerElement.style[attr]).toBe('');
					expect(lastRowElement.style[attr]).toBe('');

					scope.adapter.gridAdapter.columns[0].css(attr, value);
					expect(headerElement.style[attr]).toBe(value);
					expect(lastRowElement.style[attr]).toBe(value);
				}
			);
		});

		it('should apply css to new elements', function () {
			runGridTest(scrollSettings,
				function (head, body, scope, $timeout) {

					scope.adapter.gridAdapter.columns[0].css(attr, value);

					body.scrollTop(1000);
					body.trigger('scroll');
					$timeout.flush();

					var headerElement = getHeaderElement(head, 0);
					var lastRowElement = getLastRowElement(body, 0);
					expect(headerElement.style[attr]).toBe(value);
					expect(lastRowElement.style[attr]).toBe(value);
				}
			);
		});
	});


	describe('get and apply layout', function () {
		var layout = [
			{index: 0, mapTo: 3, css: {zIndex: '1'}},
			{index: 1, mapTo: 2, css: {zIndex: '20'}},
			{index: 2, mapTo: 1, css: {zIndex: '300'}},
			{index: 3, mapTo: 0, css: {zIndex: '4000'}}
		];
		var layoutCss = [
			{index: 0, mapTo: 0, css: {zIndex: '1'}},
			{index: 1, mapTo: 1, css: {zIndex: '20'}},
			{index: 2, mapTo: 2, css: {zIndex: '300'}},
			{index: 3, mapTo: 3, css: {zIndex: '4000'}}
		];
		var layoutOrder = [
			{index: 0, mapTo: 3, css: {}},
			{index: 1, mapTo: 2, css: {}},
			{index: 2, mapTo: 1, css: {}},
			{index: 3, mapTo: 0, css: {}}
		];

		it('should get empty layout', function () {
			runGridTest(scrollSettings,
				function (head, body, scope) {
					scope.adapter.gridAdapter.getLayout().forEach((column, index) => {
						expect(column.css['zIndex']).toBeFalsy();
						expect(column.mapTo).toBe(index);
					});
				}
			);
		});

		it('should apply some layout and then get it', function () {
			runGridTest(scrollSettings,
				function (head, body, scope) {
					scope.adapter.gridAdapter.applyLayout(layout);

					scope.adapter.gridAdapter.getLayout().forEach((column, index) => {
						expect(column.css['zIndex']).toBe(layout[index].css['zIndex']);
						expect(column.mapTo).toBe(layout[index].mapTo);
					});
				}
			);
		});

		it('should apply css layout to header elements', function () {
			runGridTest(scrollSettings,
				function (head, body, scope) {
					scope.adapter.gridAdapter.applyLayout(layoutCss);
					layoutCss.forEach((column, index) => {
						expect(getHeaderElement(head, index).style['zIndex']).toBe(column.css['zIndex']);
					});
				}
			);
		});

		it('should apply css layout to existed body elements', function () {
			runGridTest(scrollSettings,
				function (head, body, scope) {
					scope.adapter.gridAdapter.applyLayout(layoutCss);
					layoutCss.forEach((column, index) => {
						expect(getLastRowElement(body, index).style['zIndex']).toBe(column.css['zIndex']);
					});
				}
			);
		});

		it('should apply css layout to new body elements', function () {
			runGridTest(scrollSettings,
				function (head, body, scope, $timeout) {
					scope.adapter.gridAdapter.applyLayout(layoutCss);

					body.scrollTop(1000);
					body.trigger('scroll');
					$timeout.flush();

					layoutCss.forEach((column, index) => {
						expect(getLastRowElement(body, index).style['zIndex']).toBe(column.css['zIndex']);
					});
				}
			);
		});

		it('should apply order layout to header elements', function () {
			runGridTest(scrollSettings,
				function (head, body, scope) {
					scope.adapter.gridAdapter.applyLayout(layoutOrder);
					layoutOrder.forEach((column, index) => {
						expect(getHeaderElement(head, index).innerHTML).toBe('col' + (layoutOrder.length - index));
					});
				}
			);
		});

		it('should apply order layout to existed body elements', function () {
			runGridTest(scrollSettings,
				function (head, body, scope) {
					scope.adapter.gridAdapter.applyLayout(layoutOrder);
					expect(getLastRowElement(body, 0).innerHTML, 'false' || 'true');
					expect(getLastRowElement(body, 1).innerHTML, '');
					expect(getLastRowElement(body, 2).innerHTML.indexOf('item'), 0);
					expect(parseInt(getLastRowElement(body, 3).innerHTML, 10) > 0, true);
				}
			);
		});

		it('should apply order layout to existed body elements', function () {
			runGridTest(scrollSettings,
				function (head, body, scope, $timeout) {
					scope.adapter.gridAdapter.applyLayout(layoutOrder);

					body.scrollTop(1000);
					body.trigger('scroll');
					$timeout.flush();

					expect(getLastRowElement(body, 0).innerHTML, 'false' || 'true');
					expect(getLastRowElement(body, 1).innerHTML, '');
					expect(getLastRowElement(body, 2).innerHTML.indexOf('item'), 0);
					expect(parseInt(getLastRowElement(body, 3).innerHTML, 10) > 0, true);
				}
			);
		});

	});

});