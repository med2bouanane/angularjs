

# Demarrage du front ou/et packaging

##  Méthode manuelle

### Installation la première fois ou à chaque changement de version de dependances nodeJS

<code>npm install</code><br>

<code>bower install</code>

# Lancement front sur le poste developpeur

Lancez la commande suivante :

<code>gulp server --env=local</code>

# Packaging du front my-demat

Aller sur la racine du module my-demat-front et lancer les commandes suivantes dans l'ordre : <br>

<code>gulp build --env=<...> --client=<...></code>

<br>puis<br>

<code>gulp package --client=<...></code>

##  Méthode semi-manuelle

Pour lancer le serveur front en local

<code>mvn test -DskipTests=false</code>

Pour générer un package du serveur front

<code>mvn clean package -Dmy.demat.env=<ENV> -Dmy.demat.client=<CLIENT> -DskipTests=true</code>

Exemple :

<code>mvn clean package -Dmy.demat.env=dev -Dmy.demat.client=lpm -DskipTests=true</code>

Cette manipulation necessite que vous configurez votre maven pour qu'il passe le proxy :

A mettre dans votre <HOME>/.m2/settings.xml

<code xml>

  <proxies>
   <proxy>
      <id>proxy-arvato</id>
      <active>true</active>
      <protocol>https</protocol>
      <host>proxy.arvato.fr</host>
      <port>8080</port>
      <username>proxyuser</username>
      <password>somepassword</password>
    </proxy>
  </proxies>

</code>