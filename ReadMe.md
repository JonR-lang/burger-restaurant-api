# Burger Restaurant API

## Description

This is a robust API that allows users to create, read, update, and delete products, burger types, coupons, and orders.

### Note: Both the links for the complete postman documentation and the ER diagram are at the bottom of this file. Scroll to the bottom to spot the links. 

Please note that because I am using a free instance of render to host my server, it takes sometime to spin up the server after being idle for a while.

# Base URL

The base URL for this API is [https://wajusoft-ecommerce-api.onrender.com](https://wajusoft-ecommerce-api.onrender.com).

## Base Path

All endpoints in this API have a base path of `/api/`.
For example, to GET all products(burgers) in the database, you would use [https://wajusoft-ecommerce-api.onrender.com/api/products](https://wajusoft-ecommerce-api.onrender.com/api/products).

## Overview

This API is designed to provide a backend for a burger restaurant, allowing for the management of users, products, burger types, coupons, and orders. It utilizes Express.js for the server, and MongoDB as the database.

The API includes the following features:

- User authentication and management
- Product management
- Burger type management
- Coupon management
- Order management

[View complete documentation](https://documenter.getpostman.com/view/31816174/2sA3BoZWTU).

[View Entity Relationship Diagram](https://viewer.diagrams.net/?tags=%7B%7D&highlight=0000ff&edit=_blank&layers=1&nav=1&title=ER.drawio#R7Z1tc9o4F4Z%2FTT6m4xfMy8eQNLvZtttO053u82nHwQp4a2zWiCb01z8ySDYgYSwCtvA5O51ZMMY40i1d0i2d4yv3dvr6W%2BrPJp%2BSgERXjhW8Xrl3V47jWJ0B%2B192ZLk%2BYjt9b31knIYBP1YceAx%2FEX7Q4kcXYUDmWyfSJIloONs%2BOErimIzo1jE%2FTZOX7dOek2j7V2f%2BmEgHHkd%2BJB%2F9HgZ0wo%2Fa3UHxwe8kHE%2F4T%2Fed3vqDJ3%2F0Y5wmi5j%2F3pXjPq%2F%2BW3889cW1%2BB86n%2FhB8rJxyH1%2F5d6mSULXr6avtyTKClcU2%2Fp793s%2Bze87JTGt9IXOr98frT%2Fim3Hy5z9%2FfPj39br79bqzvspPP1rw8vhrTlJ%2Bw3QpCond%2Byx7Sf2n7NBwTv2U8rp0LXaA1Q71w5h91b2zV%2B%2BjyJ%2FNw9Xp6yOTMAo%2B%2BstkQcWFxLvhc%2FhKgq%2FrqszOZbX6kV0se5td%2FJld%2FJHfTPaxH4XjmL0esb88%2B8VhSubsXj76c8rPmNBpxF%2BOUz8I2Ym3SZRkdxcnMVn9ZBSJQ6zm7u%2F7lpX91vwHoaOJuOdF%2BpPch5SG8Zgf%2Bjccj1c3wupvKFcBr5WfJKXkdeMQr5LfSDIlNF2yU%2FinHa4O3nw8%2FvZlQ4p9fmyyoULX5Qd9Lv9xfuVCAuwFV4GGIjxJEeVq%2BJppejhJ0vBXpoGI19mmQlbvX8Jp5MesKfnBzqFhsuo8rJ1a4RW1raTspCBNZt%2F8dEwoPzBLwpiuysEbsn%2BsZG6td96Vx%2B71lr23i%2FfsX3Z6ytQQz2nKFJtdgzDhvJBMPEOazPhFI%2FIsrp%2Fycs9ePyWUJlMuBkX9lzWyw6LgKnCrquBcIuhKIvjyYa8M2N9PQz%2F6ynpnP141jiHvrP2i0hQ1qyzrvHx3C363E0hYcT5Hqw51EgYBYR3C8GUSUvI480fZSS8MWNtdQcXq8ipX10b9uJrVwy9WFJr21fyIdX6xT1n7YQyaS3We3%2BfxMuhJMlgwOjzcNSwF0f%2Bvzx3OWYWzDvrj%2BpvdHa14hmjldX%2FT9k6qnUqXq0E8fQRJJZBYZwRJt2mQDKqLoJ6%2BgwShuN55KdKvXFdtp4iY6W2I4DlMWStxrNifEtNhYoJEwMHDtiXNID3qpsegaXrYDlh82NWdhNbzw5VUEPmIDx2JwOOHbGwiP%2Brmh%2B00DhANN7NtAKleXa0HiGxnkqkfRoDRUV0c4NAx0PAsEB3nQkflhbCzocOSbQso7MibALLDtmQnYpo8hRHgiYeGPMDRw7Y0PAvEx7nw0W8eH7JrAQUfRRtAftiW7ESkCWR66KgDID5w2bx5fOSbUxvEB9yV86INID5sxeK5HwQpmc8hEwRXzvcXjov%2BlQEE6TROkI7cc9w3vYm3Poa4aGEVSpAtrJdwPonCOTV%2FL68ZGoGHEQsDQQzASK9xjFjy4ikYiFgYClKUhRwMEs6HUTL6QQLADNGQCDiGOJ6GB44MORNDXKtphjie7IHDmYoUrQAp4njyqHLEqhvyNERHH%2BAQYsujjs9p0K4MBZl4xZf9BU129NxkdgJXcEKsq1dlST5xOf2EBBfIqo0pdEaxvcrCMCVDgS273IBSFNi4QpbjU7a5k4wQ5g8p6stSoCEXcCMMRzbHkSdvnKPq86TxRAWi1mFOUTHYNC8K2bJ6oGQ6Nx8nRsgDHj4w0NQAfDSeqcCBG2jqYKBpXhTyWilNsjYOFx0YaLq%2FbGRvE9FROzqaT1LgaDiabWNH9epqPTtkQ3PmL6dZ%2BTnWQ0xXL8BipLpOwGHE7uOKiAkcaT5jQV%2FuQuB4WEUzQJbYYj68uc0iWcyS%2BE%2FYGdM0NAKPIwNcCTGBI82nLhjIayFgKDLApZCiLOS1kDVFbmazKAS97VtDJgBBgmsiBoDEgCQGA7irIkUjQJDYA3ldhLVtuoCcw0BDHwAJgksjJhCk%2BSQGA9nbBGRpDXB5pCgL2dy8jIeRmaEPcAwRP7kZIJAmwWK0fxntQmOHTAgU6ovAoKV4X5Ecg3Ohw0U3s9oQQqPDydvU5cQJubKXCShOyEU3My8K2cycrXnwYLyRWV%2BkkIZg4I0o0NY8%2BaRUnyiNRwq5cE1NFz3NvChkSxP20%2Bg0tAGPHGhnGkCOxoOEXLgbvV10MvOikI3MgMxHaTijYRIDBgiamXvLRpHLGQFSO0CaDxVSZHKGQpBO9epqO0E6sqc5S8MR4MmHhjjAscPuYCZvE%2BDRfHxQR%2FYsAG2m6GAy76IsFMm843HKKoMVIugtFRoqAUgSjDQ1gSTNRwh1AD%2BdroNxpnlZiI5pQwfPxKeLFHRwkIZC4DGkJ0sGGVI7QwwIDurB9bKKRoAMsXuym%2FXfwo9pSJeAGaKhEIAMwecKmcCQ5sODepAfLFQ0A6SI3ZNN7tTPAh5Au1kaCgFIEY0nWyJFzkaR5h9x2tPYntc6hnQrV1j7GSLb2%2FMkguxkaagDID80THDkx7n40fzjTfNfA8mPQeUKaz0%2F%2BrKjmUVuQ%2BZHdXWA44djaXQbyI%2Bz8aPxEHXHkvsNOC5W0QyQII4lr4U8LVjzS78tZwSyk6WjEngkUWzDQJLUT5LGQ9MdD%2B6aetEIkCOOJ3MkCAlr3csvKXkmrCghR4voSAUcTDry2vrtKul3OVF26HGhadPSrFhJzjqdJGqsNIKVWPcwRltxghycLtdV10nyKMXTRx9iApxqwwydyLXqK7SmpFRTxJMBSqnWwRw4eVHIC%2BiX85Sh%2BnKqaSgG3GgDZ64VkaIxc9VHSuMTV8DzVpy2FkWhmrXOGVIgP%2FoU56olZYP7wA2gR%2BN51TyNeWnb6IFbwPOikKel5HUWpgTwU4Y05AEPHvLs9YGS6X61tMjnrPvxEPkmC46MjuXJMhsodJGD5PTQwJysJzczverbhUvMTJUOzjd2kPd8AzIzPUzLmheFvJt7hQPzd93U52RqyKVkONE97XCiyuVq0I%2B4DeTJ6eai%2BjxROZm18qQLeS9n3gYQJ13ZyxSPGzIeKEYIBB5A0Mw0ACAqM7NegMA1M7toZuZFIZuZmBRJQx%2Fw6IHJLAygh%2FIJEfXiA24uiy6mssiLQpHJAnQksoY2wKHD7stzVWRH%2FexQPSCiVnbYfY0paMvgUTQCpIfdl%2Beg88UTTbKmDhYhOgoBx5CuvHo2XAWus2NZ7Ho5T65wU8URmyp6YrLBAeJV3cY9OBdAMLd7xYGEzsi1egodUwLEFJndAe2pwNzuRVHIE4tLSmdS38YKzPZeUja4Lnby2ak%2BVBoPEVOkem%2B4%2F6htbop53ouikNfFaEgjwM4mpnjfXzaOpUhmwgRRzg%2BcjV4dMRt1Xd40BTCqhoWdb4u%2FY2HCkpPPR4s2dTkTUscCnbKkaAc4gHAsRdISVt84Gz1OLwDHFBg4dvL56BFQaXxC6ljyJgs4W%2F2LZoBMcSx59YuV8dR8ppihD3gMEU%2FfRYY0ypDGM5c4NtzEV0UjQII4trxSBny7jY48AAIEF8VMAIhyv3%2FNBIG7Lla0AiQI65rUBLl5Zr99Bz6Noo5W4OFEkQsLcdIATlQhADU%2FQUZ2NwGZWhpRG60HiiIz1mJOUtCmloY%2B2gyRl0%2Bd%2F16fXboc%2FLX4QAbT8c3TP9e2pAsSjIlYsWK97yQZJ7EfvS%2BO7jxvpTjnY7KSxGqfAqF0yZHiL2iyXXHkNaR%2Fi26Cvf5f9vqdx9%2FdvW58dCdww%2Bo4Xf4tLpC92fhW9rb42uqd%2BN4KbjdpulLW%2B69Mu9%2BST368FB%2Fdh1GUfzFQn8g%2B2DiNrnj2haQhK3ySPq6lXFyD%2F9m2t4PW1QGFZnkNJIt0REpk7PI%2Bngqc7jtRrLFkFVkq9pREPg1%2Fkq37eAuclApzm1SYXYPCdmUjCUaliWqKPKF8vKryEVc0RD6di%2BugrDfIZ%2BrHweeKEirR1C%2BSJntFdbyG7H6%2FoojE01MMEZF3cX3QW0S0H13lPVEhvl3J7EWefeJOqqK87EHPKH11295Jycw6NH7a6oL0OrPj9SMicg5DzjJrkDRou4DaNkiyzOqAxLJbewVUtQfaFELpTE2SzUGJHq8rRzzS4bCwhFlhirDkrQ7fw%2FkkCucYj3F1%2BniM7s4jF67tTo3pAdQKkDc5lNc81FUGtSVZ3qqMjMZQ37K8d6GdwRjljQDUEoO6KOStCy%2BcCOavMpwlHOOtioG36CDvekCkVF%2B4PhFS6ozFUN%2ByvH%2BhlavW5W0AiWLLuxdgPXXhrQKBB5C%2BpAvT7Y5r653FhL7lediue8D1WL3LDYxN7GmZsSo3Q%2BV%2FiLedN7kdtsvtzE23o3SQZIrZ0agNW%2Fs60Rssennl6OiVxtLO76Bf5pq10Ch2lm8%2Bjy4ep2xUQUr28aJhdrRhZlvi2V18VJtvqT6YwcQ517jWkT1TnN680THLG9blOGai1mE6ZhpNue3zG0e2TsMcCuZPcerzzI7IXwVmyuNgVqyTe2b6UGncM3M0rNOWOWYOyHxY6qKQndPYn8LIp%2FlWbcAjB6a%2BMoAcdWYtUd%2ByHBkGhhwgs16pi0JOekXLnvTSfnJgxqu9ZSN%2B8oKWWc4aHVhqie%2FG8cimuqzIqna4OPFwYESHzw%2Fq98M%2FkF%2Bd7tPTj8nNQ5SO%2FM%2Bd79G3a9kJTf2VG4xWuMoKlzohhVxKrHCxV1RMVqvOVvP%2B5uT1L1ugOPQsd8IPSGB%2FKzPCCFfeXpt3jh5TXU7rh57KP1s2MNcsAOSAn1AtbR6MKssB94zquhinR0md9rfy9jQyXl2Wh3FMXXkwOSLbmVmbNp0hJigDHDM0LE9kxpmYUafxrbw92fEEzIw%2BTGYoUvePkum0bFMmRG7sUQc4boguAsHRIDhqTdOtloHsXLUmQO0oKwKoc6XYe9fypKqnVAc4eohQXAwj0gwjUkeyrQtzZ0HzyMi0niIPj47rWs%2BqqdNovsKj1t01BaSTr1Jr4X1%2F3iZdAZUODA8uxO9xYCrrh3%2F1SzaoK%2FrQfN%2FZjh8rrsATXq2%2FVIiQFY%2B%2F3DiNDxX3%2Fsygt%2F0zvYG3ebmD53f5%2B33nX%2B8uVGuev3077MX6D6zYibO3aZLQzdMZBSefkoBkZ%2Fwf#%7B%22pageId%22%3A%223zrxKgcNgWnYmIpRc7oD%22%7D).

If link doesn't open, please refer to the png file in the root directory. 