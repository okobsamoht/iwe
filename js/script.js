$(function(){

	//tableaux contenant tous les clients
	var clients = [];
	//tableaux contenant toutes les locations
	var locations = [];
	//tableaux contenant toutes les motos
	var motos = [];

	//objet client
	var clientObjet = {
		init: function(a,b,c,d,e,f){
			this.nomC = a;
			this.prenomC = b;
			this.telephoneC = c;
			this.emailC = d;
			this.adresseC = e;
			this.statutC = f;
		},
		louerMoto: function(){}
	}

	//objet moto
	var motoObjet = {
		init: function(a,b,c,d,e){
			this.marque = a;
			this.model = b;
			this.type = c;
			this.prix = d;
			this.nombre = e;
			this.seuil = 3;
			this.dispo = this.nombre-this.seuil;
		},

	}

	//objet location
	var locationObjet = {
		init: function(a,b,c,d,e,f){
			//le mot clé "this" représente l'objet lui meme 
			this.locClient = a;
			this.locMoto = b;
			this.dataDebut = c;
			this.dataFin = d;
			this.duree = e;
			this.motoid = f;
		},
		louerMoto: function(){}
	}

	//affichage dynamique de la valeur du champ de selection de la durée
	$('#duree').on('change',function(){
		$('#valDuree').html('Durée '+this.value+' Jours');
	});

	//fonction pour afficher la liste de tous les clients
	var afficherClients = function(){

		//vider l'élément qui affiche les clients
		$('#listClient').html('');
		$('#locClient').html('');

		clients = JSON.parse(localStorage.getItem('clients'));

		//boucle de répétition
		$.each(clients, function(i,c){
			$('#listClient').append('\
			    <a href="#" class="list-group-item">\
			      <h4 class="list-group-item-heading"><span class="text-primary">'+c.nomC+'</span></h4>\
			      <p class="list-group-item-text">\
			      <strong>Email:</strong> '+c.emailC+' <strong>Tél:</strong> '+c.telephoneC+' <strong>Statut:</strong> '+c.statutC+'</p>\
			      <p class="list-group-item-text">'+c.adresseC+'</p>\
			    </a>\
				');
			$('#locClient').append('<option>'+c.nomC+' '+c.prenomC+'</option>');
		});
	};

	var afficherMotos = function(){

		//vider l'élément qui affiche les clients
		$('#listeMoto').html('');
		$('#locMoto').html('');

		//boucle de répétition
		$.each(motos, function(i,c){
			$('#listeMoto').append('\
				<a href="#" class="list-group-item">\
				  <h4 class="list-group-item-heading"><span class="text-primary">'+c.marque+' - '+c.model+'</span></h4>\
				  <p class="list-group-item-text">\
				  <strong>Type:</strong>'+c.type+' <strong>Nombre:</strong> '+c.nombre+' <strong>Disponible:</strong> '+c.dispo+' <strong>Seuil:</strong> <span class="text-danger">'+c.seuil+'</span></p>\
				<button class="btn btn-xs btn-danger im" data-id="'+i+'">Augmenter stock</button></a>				\
				');
			$('#locMoto').append('<option value="'+i+'">'+c.marque+' '+c.model+'</option>');
		});

		$('.im').on('click', function(){
			var mid = $(this).attr('data-id');
			motos[mid].nombre++;
			motos[mid].dispo = motos[mid].nombre - motos[mid].seuil;
			localStorage.setItem('motos',JSON.stringify(motos));
			afficherMotos();
		});
	};

	var afficherLocations = function(){

		//vider l'élément qui affiche les clients
		$('#listLocation').html('');

		//boucle de répétition
		$.each(locations, function(i,c){
			$('#listLocation').append('\
				    <a href="#" class="list-group-item">\
				      <h4 class="list-group-item-heading"><span class="text-primary">'+c.locClient+'</span> a louer une <span class="text-primary">'+c.locMoto+'</span></h4>\
				      <p class="list-group-item-text">Durée: <span class="text-warning">'+c.duree+'jours</span>  Du '+c.dataFin+' au <span class="text-danger">'+c.dataDebut+'</span></p>\
				    <button class="btn btn-xs btn-danger fl" data-id="'+i+'">Fin Location</button></a>\
				');
		});

		//detecter le click sur les boutton qui ont pour classe .fl
		$('.fl').on('click', function(){
			//recuperation de lindex de la location à supprimé
			//lindex est sotcké dans l'attribut data-id
			//le $(this) représente l'éléme,t html qui a declencher l'evenement
			var lid = $(this).attr('data-id');
			///récupération de l'id de la motot louée
			var mid = locations[lid].motoid;
			//incrementation du stock disponible de la motos
			motos[mid].dispo++;
			//rafraishissement de la liste des motos
			afficherMotos();
			//suppression de la location 
			locations.splice(lid,1);
			//rafraishissement de la liste des locations
			afficherLocations();
		});

	};

	//enreristrement d'un client suite au click du button enregistrer du formulaire client
	$('#saveClient').on('click',function(){

		//récupération des valeurs des champs du formulaire
		var nom = $('#nom').val();
		var prenom = $('#prenom').val();
		var telephone = $('#telephone').val();
		var email = $('#email').val();
		var adresse = $('#adresse').val();
		var statut = $('#statut').val();

		//création de l'objet client
		var client = Object.create(clientObjet);

		//remplissages des propriétés de l'objet client par les valeurs récupérés
		client.init(nom,prenom,telephone,email,adresse,statut);

		//ajout de l'objet client au tableaux CLIENTS qui contient tous les clients
		clients.push(client);
		localStorage.setItem('clients',JSON.stringify(clients));

		//fermetture du modale du formulaire client
		$('#modalClient').modal('hide')

		//appel de la fonction d'affichage des clients après mise à jours

		afficherClients();
	});

	$('#saveMoto').on('click',function(){

		var marque = $('#marque').val();
		var model = $('#model').val();
		var type = $('#type').val();
		var prix = $('#prix').val();
		var nombre = $('#nombre').val();

		var moto = Object.create(motoObjet);

		moto.init(marque,model,type,prix,nombre);

		motos.push(moto);

		$('#modalMoto').modal('hide')

		afficherMotos();
	});

	$('#saveLocation').on('click',function(){

		var locClient = $('#locClient').val();
		var locMoto = $('#locMoto option:selected').text();
		var mid = $('#locMoto').val();
		var dataDebut = $('#dataDebut').val();
		var dataFin = $('#dataFin').val();
		var duree = $('#duree').val();

		var loc = Object.create(locationObjet);

		loc.init(locClient,locMoto,dataDebut,dataFin,duree,mid);

		locations.push(loc);

		///traitement stock moto
		
		motos[mid].dispo--;

		afficherMotos();
		/////

		$('#modalLocation').modal('hide')

		afficherLocations();
	});

    afficherClients();
    afficherLocations();
    afficherMotos();
})