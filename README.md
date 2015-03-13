Jekyll search
=============

Basic Jekyll setup with search via JSON.

Version history
---------------

| Version no. | Description  | Date |
| --- | --- | --- |
| 0.3 | Support for collections | 13 March 2014 |
| 0.2.1 | Used built-in jsonify filter (thanks to [davekinkead](https://github.com/davekinkead)) | 25 September 2014 |
| 0.2 | Used built-in ruby JSON (thanks to [mrvdb](https://github.com/mrvdb)) | 20th May 2014 |
| 0.1 | First draft | 24th February 2014 |


Usage
-----

Use on an existing Jekyll installation (http://jekyllrb.com/)

* Place ```_plugins```, ```feeds```, ```search``` and ```scripts``` directories in root of jekyll installation
* Add ```url: http://example.com``` to ```_config.yml```


Omissions
----------
* To omit a page or post from search add ```search_omit: true``` to YAML Front Matter 


Notes
-----

* To run locally use local domain as url in ```_config.yml``` e.g. ```url: http://localhost:4000```
* jQuery library is included in ```/search/index.html``` - Remove if not needed, or move to ```<head>``` if preferred
