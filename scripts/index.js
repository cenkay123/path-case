'use strict';
$(document).ready(function () {
  const loading = $('#loading')  
  loading.hide()
  const base_url = 'https://www.cheapshark.com/api/1.0';
  const api_get =  (url, getSuccess, getError) => {
    loading.show()
    $.get(base_url + url).done((res) => {
      loading.hide()
      getSuccess(res)
    }).fail((err) => {
      loading.hide()
      getError(err)
    });
  }
  const fetchGames = async () => {
    await api_get('/games?title=batman&limit=60&exact=0', gamesSuccess, gamesError)
  }
  const gamesSuccess = (games) => {
    games.forEach((game) => {
        fetchGameDealsDetail(game.gameID)
    })
  }
  const gamesError = (err) => {
    customAlert('danger', 'Kayit Bulunamadi.');
    console.error(err);
  }

  const fetchGameDealsDetail = async (gameId) => {
    await api_get('/games?id=' + gameId, fetchGameDealsDetailSuccess, fetchGameDealsDetailError)
  }
  const fetchGameDealsDetailSuccess = (dealsDetail) => {
    const deals = dealsDetail.deals.sort((a, b) => {
        return b.savings - a.savings
      });
      if(Math.ceil(deals[0].savings) > 0) {
          fetchGameDetail(deals[0].dealID)
      }
  }
  const fetchGameDealsDetailError = (err) => {
    customAlert('danger', 'Oyunlarin Fiyatlarina Ulasilamadi.');
    console.error(err);
  }

   const fetchGameDetail = async (dealId) => {
      await api_get('/deals?id=' + dealId, fetchGameDetailSuccess, fetchGameDetailErrror)
   }

    const fetchGameDetailSuccess = (gameDetail) => {
        singleGame(gameDetail.gameInfo)
    }
    const fetchGameDetailErrror = (err) => {
        customAlert('danger', 'Oyun Bulunamadi.');
        console.error(err);
    }

    const customAlert = (cls, text) => {
      $('.games-list').append(`<div class="alert alert-${cls} text-center w-100">${text}</div>`)
    }

    const singleGame = (game) => {
      $('.games-list').append(
        `<div class="card shadow" style="width: 22rem;">
          <span class="card-info">
            <img src="./images/info_icon.png" alt="info">
          </span>
          <img class="card-img-top" src="${game.thumb}" alt="Card image cap">
          <div class="card-body">
            <h5 class="card-title">${game.name}</h5>
            <p class="card-text">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
             been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and 
             scrambled it to make a type specimen book</p>
            <ul class="tags">
              <li class="tag" title="${game.steamRatingText !== null ? game.steamRatingText : 'Degerlendirme bulunamadi.'}">${game.steamRatingText !== null ? game.steamRatingText : '-'}</li>
              <li class="tag">100 / <i>${game.steamRatingPercent !== null ? game.steamRatingPercent : '-'}</i></li>
              <li class="tag">%${ Math.floor((game.retailPrice - game.salePrice) / game.retailPrice * 100) } indirim</li>
            </ul>
          </div>
          <div class="card-bottom">
            <div class="card-prices">
              <div class="price">$${game.salePrice}</div>
              <div class="old-price">$${game.retailPrice}</div>
            </div>
            <button class="btn btn-success order-btn">ORDER</button>
          </div>
        </div>`
      )
    }
    fetchGames()
});
