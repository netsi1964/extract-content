# extract-content
A service which has an endpoint to extract data from an URL using CSS selectors

You may see example of use on [this pen on CodePen.io](https://codepen.io/netsi1964/details/mxLqPG/).

I have also made a test page where you can try it out: [Extract content from any website](https://codepen.io/netsi1964/pen/XEYggj/).

You can read a series of post about the project on Medium.com: [Let’s build a content extract endpoint](https://medium.com/@netsi1964/lets-build-a-content-extract-endpoint-part-1-27d0aceda31).

## Endpoints

### `/`
Returns a JSON object with fetched texts from the specified selectors.

Example request:

`from`=`https://www.dr.dk`
`&extract`=`%7B"overskrift"%3A".dredition-summary"%7D`

The extract values have been encoded using `encodeURIComponent`.

Original json value:
```
{"overskrift":"p"}
``` 

Same json value encoded:
```
%7B%22overskrift%22%3A%22p%22%7D
```


| parameter | description | required |
| --------- | ----------- | -------- |
| from      | The url to fetch content from | Yes |
| extract | json object with `name:selector`| yes |

### `/html`
Returns a JSON with either the whole HTML from the specified `from` url, or as with `/` endpoint, but not the *text* but the **html**.

| parameter | description | required |
| --------- | ----------- | -------- |
| from      | The url to fetch content from | Yes |
| extract | json object with `name:selector`| no |

----



Created by Sten Hougaard, Marts 2018. [@netsi1964](https://twitter.com/netsi1964).