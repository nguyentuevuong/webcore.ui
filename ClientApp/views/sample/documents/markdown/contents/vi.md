## Ngôn ngữ đánh dấu văn bản thô (`Markdown`) #{ngon-ngu-danh-dau-van-ban-tho}

#### Giải thích #{giai-thich}
> `Markdown` là một ngôn ngữ đánh dấu với cú pháp văn bản thô, được thiết kế để có thể dễ dàng chuyển thành HTML và nhiều định dạng khác sử dụng một công cụ cùng tên. Nó thường được dùng để tạo các tập tin readme, viết tin nhắn trên các diễn đàn, và tạo văn bản có định dạng bằng một trình biên tập văn bản thô.

#### Sử dụng #{su-dung}
> Tất cả các bài viết hướng dẫn ở trong hệ thống này sẽ được viết dưới dạng markdown (`md`) và đặt vào thư mục `contents` cùng cấp với `view` và `viewmodel`.

## Cú pháp #{cu-phap}

#### Headline
> Để biểu thị một đường kẻ ngang (thẻ `<hr />`) ta chỉ cần sử dụng 3 ký tự (trở lên) `-` hoặc `=` liên tiếp trên một dòng văn bản.

```raw
Three or more...
---
Hyphens
***
Asterisks
___
Underscores
===
As
```

Three or more ...
---
Hyphens
***
Asterisks
___
Underscores
===
As


#### Headers
> Để biểu thị một thẻ header (`<h1>H1</h1>`, `<h2>H2</h2>`, `<h3>H3</h3>`, `<h4>H4</h4>`, `<h5>H5</h5>`, `<h6>H6</h6>`) ta sử dụng theo cú pháp `# title #{id}`

```raw
# H1 #{h1}
## H2 #{h2}
### H3 #{h3}
#### H4 #{h4}
##### H5 #{h5}
###### H6 #{h6}
```
# H1 #{h1}
## H2 #{h2}
### H3 #{h3}
#### H4 #{h4}
##### H5 #{h5}
###### H6 #{h6}

---
#### Đậm, nghiêng

```raw
Emphasis, aka italics, with *asterisks* or _underscores_.

Strong emphasis, aka bold, with **asterisks** or __underscores__.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~
```

Emphasis, aka italics, with *asterisks* or _underscores_.

Strong emphasis, aka bold, with **asterisks** or __underscores__.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~


#### Danh sách
```raw
1. First ordered list item
2. Another item
    - Unordered sub-list.
    - Unordered sub-list.
1. Actual numbers don't matter, just that it's a number
    1. Ordered sub-list
    1. Ordered sub-list
4. And another item.
```

1. First ordered list item
2. Another item
    - Unordered sub-list.
    - Unordered sub-list.
1. Actual numbers don't matter, just that it's a number
    1. Ordered sub-list
    1. Ordered sub-list
4. And another item.


#### Liên kết
```raw
[I'm an inline-style link](https://www.google.com)

[I'm an inline-style link with title](https://www.google.com "Google's Homepage")

[I'm a reference-style link][Arbitrary case-insensitive reference text]

[I'm a relative reference to a repository file](../blob/master/LICENSE)

[You can use numbers for reference-style link definitions][1]

Or leave it empty and use the [link text itself].

URLs and URLs in angle brackets will automatically get turned into links. 
http://www.example.com or <http://www.example.com> and sometimes 
example.com (but not on Github, for example).

Some text to show that the reference links can follow later.

[arbitrary case-insensitive reference text]: https://www.mozilla.org
[1]: http://slashdot.org
[link text itself]: http://www.reddit.com
```

[I'm an inline-style link](https://www.google.com)

[I'm an inline-style link with title](https://www.google.com "Google's Homepage")

[I'm a reference-style link][Arbitrary case-insensitive reference text]

[I'm a relative reference to a repository file](../blob/master/LICENSE)

[You can use numbers for reference-style link definitions][1]

Or leave it empty and use the [link text itself].

URLs and URLs in angle brackets will automatically get turned into links. 
http://www.example.com or <http://www.example.com> and sometimes 
example.com (but not on Github, for example).

Some text to show that the reference links can follow later.

[arbitrary case-insensitive reference text]: https://www.mozilla.org
[1]: http://slashdot.org
[link text itself]: http://www.reddit.com

#### Liên kết ảnh

```raw
![µmd.js](http://simonwaldherr.de/umd.png)
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png)
```
![µmd.js](http://simonwaldherr.de/umd.png)
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png)


#### Mã
<pre>
```raw
var s = "JavaScript syntax highlighting";
alert(s);
```
 
```pytrawhon
s = "Python syntax highlighting"
print s
```
 
```raw
No language indicated, so no syntax highlighting. 
But let's throw in a <b>tag</b>.
```
</pre>