
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
			top: '0.2cm',
			bottom: '0.5cm',
			left: '0.4cm',
			right: '0.4cm',
		},
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

