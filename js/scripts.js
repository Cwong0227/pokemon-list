let pokemonRepository = (function() {
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=649';


    function add(pokemon) {
        if (
            typeof pokemon === 'object' &&
            'name' in pokemon

        ) {
            pokemonList.push(pokemon);
        } else {
            document.write('This pokemon is not correct');
        }
    }

    function getAll() {
        return pokemonList;
    }


    function addListPokemon(pokemon) {
        let pokemonList = document.querySelector('.pokemon-list');
        let listOfPokemon = document.createElement('li');
        let button = document.createElement('button');

        pokemonList.append(listOfPokemon);
        listOfPokemon.append(button);

        button.innerText = pokemon.name;
        button.classList.add('btn');
        button.classList.add('btn-light');
        button.classList.add('button-list');


        button.addEventListener('click', function() {
            showDetails(pokemon);
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
                        detailsUrl: item.url,
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

                item.name = details.name;
                item.imageUrl = details.sprites.other.dream_world.front_default;
                item.height = details.height;
                item.weight = details.weight;
                item.types = details.types;
                item.abilities = details.abilities;
            })
            .catch(function(e) {
                console.error(e);
            });
    }


    function showDetails(pokemon) {
        loadDetails(pokemon).then(() => {
            showModal(pokemon);
        });
    }

    function showModal(item) {
        let modalBody = $('.modal-body');
        let modalHeader = $('.modal-header');
        let modalTitle = $('.modal-title');
        let btnClose = $('#btnClose');


        $('#modal-container').modal('show');

        modalHeader.empty();
        modalTitle.empty();
        modalBody.empty();


        let nameElement = $('<h3>' + item.name + '</h3>');


        let imageElement = $('<img class="modal-img">');
        imageElement.attr('src', item.imageUrl);


        let heightElement = $('<p>' + 'Height : ' + item.height + ' dm ' + '</p>');


        let weightElement = $('<p>' + 'Weight : ' + item.weight + ' hg ' + '</p>');


        let typesElement = document.createElement('p');
        item.types.forEach(function(el, index) {
            if (item.types.length - 2 == index) {
                typesElement.textContent += 'Type : ' + el.type.name + ', ';
            } else {
                typesElement.textContent += 'Type : ' + el.type.name;
            }
        });


        let abilitiesElement = document.createElement('p');
        item.abilities.forEach(function(el, index) {
            if (item.abilities.length - 1 == index) {
                abilitiesElement.textContent += 'Ability : ' + el.ability.name;
            } else {
                abilitiesElement.textContent += 'Ability : ' + el.ability.name + ', ';
            }
        });


        modalHeader.append(nameElement);
        modalBody.append(imageElement);
        modalBody.append(typesElement);
        modalBody.append(heightElement);
        modalBody.append(weightElement);
        modalBody.append(abilitiesElement);
        modalHeader.append(btnClose);
    }

    document.querySelector('button').addEventListener('click', () => {
        showModal();
    });

    return {
        add: add,
        getAll: getAll,
        addListPokemon: addListPokemon,
        loadList: loadList,
        loadDetails: loadDetails,
        showDetails: showDetails,
    };
})();


pokemonRepository.loadList().then(function() {
    pokemonRepository.getAll().forEach(function(pokemon) {
        pokemonRepository.addListPokemon(pokemon);
    });
});