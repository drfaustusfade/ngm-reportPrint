
	// params
	var page = require( 'webpage' ).create(),
			system = require( 'system' ),
			fs = require( 'fs' );

	// page]
	var header_1 = system.args[ 1 ];
	var header_2 = system.args[ 2 ];
	var footer = system.args[ 3 ];
	var output = system.args[ 5 ];

	// page settings
	page.paperSize = {
		format: 'A4',
		orientation: 'portrait',
		margin: {
			top: '1cm',
			bottom: '1cm',
			left: '1cm',
			right: '1cm',
		},
		// header: {
		// 	height: '1.1cm',
		// 	contents: phantom.callback( function() {
		// 		return '' +
		// 			'<h3 style="font-family: verdana, arial, sans-serif; font-size: 9px; margin:0px; font-weight: 300;">' + header_1 + '</h3>' +
		// 			'<h3 style="font-family: verdana, arial, sans-serif; font-size: 8px; margin:0px 0px 10px 0px; color: #616161; font-weight: 300;">' + header_2 + '</h3>';
		// 	})
		// },
		footer: {
			height: '1cm',
			contents: phantom.callback( function ( pageNum, numPages ) {
				return '' +
				'   <div style="font-family: verdana, arial, sans-serif; font-size: 8px; color: #888; padding:10px 10px 0 10px; border-top: 1px solid #ccc;">' +
				'       <span style="float:left">' + footer + '</span> ' +
				'       <span style="float:right">' + pageNum + ' / ' + numPages + '</span>' +
				'   </div>';
			})
		}
	};

	// dpi
	page.settings.dpi = '96';

	// content
	page.content = fs.read( system.args[ 4 ] );

	// output
	// window.setTimeout( function () {
	page.onLoadFinished = function() {
		page.render( output, { format: 'pdf' });
		phantom.exit();
	};
	// }, 2000 );

