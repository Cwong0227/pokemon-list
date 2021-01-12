let pokemonRepository = (function() {
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    function add(pokemon) {
        pokemonList.push(pokemon);
    }

    function getAll() {
        return pokemonList;
    }


    function addListItem(pokemon) {
        pokemonRepository.loadDetails(pokemon).then(function() {
            var $row = $(".row");

            var $card = $('<div class="card" style="width:400px"></div>');
            var $image = $(
                '<img class="card-img-top" alt="Card image" style="width:20%" />'
            );
            $image.attr("src", pokemon.imageUrl);
            var $cardBody = $('<div class="card-body"></div>');
            var $cardTitle = $("<h4 class='card-title' >" + pokemon.name + "</h4>");
            var $seeProfile = $(
                '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#pokedexmodal">See Profile</button>'
            );

            $row.append($card);
            //Append the image to each card
            $card.append($image);
            $card.append($cardBody);
            $cardBody.append($cardTitle);
            $cardBody.append($seeProfile);

            $seeProfile.on("click", function(event) {
                showDetails(pokemon);
            });
        });
    }


    function showDetails(pokemon) {
        loadDetails(pokemon).then(function() {
            showModal(pokemon);
        });
    }


    function loadList() {
        return fetch(apiUrl)
            .then(function(response) {
                return response.json();
            })
            .then(function(json) {
                json.results.forEach(function(item) {
                    let pokemon = {
                        name: item.name,
                        detailsUrl: item.url
                    };
                    add(pokemon);
                });
            })
            .catch(function(e) {
                console.error(e);
            });
    }


    function loadDetails(item) {
        let url = item.detailsUrl;
        return fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(details) {

                item.imageUrl = details.sprites.front_default;
                item.height = details.height;
                item.weight = details.weight;
                item.types = [];
                for (let i = 0; i < details.types.length; i++) {
                    item.types.push(' ' + details.types[i].type.name);
                }
            })
            .catch(function(e) {
                console.error(e);
            });
    }


    function showModal(item) {
        let modalBody = $(".modal-body");
        let modalTitle = $(".modal-title");
        let modalHeader = $(".modal-header");
        // let $modalContainer = $("#modal-container");
        //clear existing content of the model
        // modalHeader.empty();
        modalTitle.empty();
        modalBody.empty();

        //creating element for name in modal content
        let nameElement = $("<h1>" + item.name + "</h1>");
        // // creating img in modal content
        let imageElementFront = $('<img class="modal-img" style="width:50%">');
        imageElementFront.attr("src", item.imageUrl);
        let imageElementBack = $('<img class="modal-img" style="width:50%">');
        imageElementBack.attr("src", item.imageUrlBack);
        // //creating element for height in modal content
        let heightElement = $("<p>" + "height : " + item.height + "</p>");
        // //creating element for weight in modal content
        let weightElement = $("<p>" + "weight : " + item.weight + "</p>");
        // //creating element for type in modal content
        let typesElement = $("<p>" + "types : " + item.types + "</p>");
        // //creating element for abilities in modal content
        let abilitiesElement = $("<p>" + "abilities : " + item.abilities + "</p>");

        modalTitle.append(nameElement);
        modalBody.append(imageElementFront);
        modalBody.append(imageElementBack);
        modalBody.append(heightElement);
        modalBody.append(weightElement);
        modalBody.append(typesElement);
        modalBody.append(abilitiesElement);
    }

    return {
        add: add,
        getAll: getAll,
        addListItem: addListItem,
        showDetails: showDetails,
        loadList: loadList,
        loadDetails: loadDetails,
        showModal: showModal
    };
})();


pokemonRepository.loadList().then(function() {
    pokemonRepository.getAll().forEach(function(pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
});