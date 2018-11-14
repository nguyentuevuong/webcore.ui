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
> Để biểu thị một thẻ header (`<h1>H1</h1>`, `<h2>H2</h2>`, `<h3>H3</h3>`, `<h4>H4</h4>`, `<h5>H5</h5>`, `<h6>H6</h6>`) ta sử dụng theo cú pháp `# tiêu đề #{id}`

###### Mã
```raw
# H1 #{h1}
## H2 #{h2}
### H3 #{h3}
#### H4 #{h4}
##### H5 #{h5}
###### H6 #{h6}
```
###### Kết quả
# H1 #{h1}
## H2 #{h2}
### H3 #{h3}
#### H4 #{h4}
##### H5 #{h5}
###### H6 #{h6}

---
#### Đậm, nghiêng
> Để hiển thị những ký tự đậm, nghiêng, gạch ngang ta viết như sau: `*nghiêng*` hoặc `_nghiêng_`, `**đậm**` hoặc `__đậm__`, `~~gạch ngang~~`

###### Mã
```raw
Emphasis, aka italics, with *asterisks* or _underscores_.

Strong emphasis, aka bold, with **asterisks** or __underscores__.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this~~.
```
###### Kết quả
Emphasis, aka italics, with *asterisks* or _underscores_.

Strong emphasis, aka bold, with **asterisks** or __underscores__.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~


#### Danh sách #{danh_sach}
> Danh sách có 2 dạng, một là danh sách có sắp xếp `orderlist` hay `ol`, hai là danh sách không sắp xếp `unoderlist` hay `ul`.
> Để hiển thị danh sách có sắp xếp, ta đánh số dạng `1. ` trước mỗi mục của danh sách.
> Để hiển thị danh sách không sắp xếp, ta đánh dấu `-` hoặc `+` trước mỗi mục của danh sách.
> Có thể lồng nhiều danh sách vào nhau như ví dụ dưới đây (mỗi danh sách sẽ thụt vào 1 dấu cách tuỳ theo thứ tự lồng nhau):

###### Mã
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
###### Kết quả
1. First ordered list item
2. Another item
    - Unordered sub-list.
    - Unordered sub-list.
1. Actual numbers don't matter, just that it's a number
    1. Ordered sub-list
    1. Ordered sub-list
4. And another item.


#### Liên kết #{lien_ket}
> Liên kết trong phiên bản markdown này hỗ trợ những kiểu liên kết sau:
> Dạng chuẩn: `[văn bản liên kết](đường link liên kết)`
> Dạng chuẩn, có tiêu đề: `[văn bản liên kết](đường link liên kết "tiêu đề liên kết")`
> Dạng mở rộng đơn: `[văn bản/chỉ dấu liên kết]` sẽ có chỉ dấu liên kết `[chỉ dấu liên kết]: (đường link liên kết)`
> Dạng mở rộng kép: `[văn bản liên kết][chỉ dấu liên kết]` sẽ có chỉ dấu liên kết `[chỉ dấu liên kết]: (đường link liên kết)`

###### Mã
```raw
[I'm an inline-style link](https://www.google.com)
[I'm an inline-style link with title](https://www.google.com "Google's Homepage")
[I'm a reference-style link][Arbitrary case-insensitive reference text]
[I'm a relative reference to a repository file](../blob/master/LICENSE)
[You can use numbers for reference-style link definitions][1]
Or leave it empty and use the [link text itself].
Some text to show that the reference links can follow later.

[arbitrary case-insensitive reference text]: https://www.mozilla.org
[1]: http://slashdot.org
[link text itself]: http://www.reddit.com
```
###### Kết quả
[I'm an inline-style link](https://www.google.com)
[I'm an inline-style link with title](https://www.google.com "Google's Homepage")
[I'm a reference-style link][Arbitrary case-insensitive reference text]
[I'm a relative reference to a repository file](../blob/master/LICENSE)
[You can use numbers for reference-style link definitions][1]

Or leave it empty and use the [link text itself].
Some text to show that the reference links can follow later.

[arbitrary case-insensitive reference text]: https://www.mozilla.org
[1]: http://slashdot.org
[link text itself]: http://www.reddit.com

#### Liên kết ảnh #{lien-ket-anh}
> Để hiển thị một liên kết ảnh, ta có cấu trúc như sau: `![tiêu đề của ảnh](đường link dẫn tới ảnh)`:

###### Mã
```raw
![µmd.js](http://simonwaldherr.de/umd.png)
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png)
```
###### Kết quả
![µmd.js](http://simonwaldherr.de/umd.png)
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png)


#### Thẻ mã (code) #{ma}
> Để hiển thị một đoạn mã trong một dòng như `let a = 'universal';`, thì chỉ cần dùng cặp nháy sau:

<pre>
`norenderlet a = 'universal';`
</pre>

> Để hiển thị một đoạn mã trong nhiều dòng, thì viết như ví dụ bên dưới:

<pre>
```norender javascript
var s = "JavaScript syntax highlighting";
alert(s);
```
 
```norender python
s = "Python syntax highlighting"
print s
```
 
```norender html
No language indicated, so no syntax highlighting. 
But let's throw in a <b>tag</b>.
```
</pre>