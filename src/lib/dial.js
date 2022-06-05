/**
 *
 *  Class: Dial ( Module )
 *
 *
 *  purpose: To fetch data from api in various ways and request types
 *           in a easy but, configurable way
 *
 */




 export class Dial {



    /**
    *
    *  @method: getCookie
    *
    *
    * @purpose: this method is used to get the cookie from the browser
    */

     getCookie(name) {
       var nameEQ = name + "=";
       var ca = document.cookie.split(";");
       for (var i = 0; i < ca.length; i++) {
           var c = ca[i];
           while (c.charAt(0) === " ") c = c.substring(1, c.length);
           if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
       }
       return null;
   }


   /**
    * 
    *  @method: getLocalItem 
    * 
    *  @purpose: to get the local storage item by the name
    * 
    */

   getLocalItem(name) {
         return localStorage.getItem(name);
    }

    // @purpose: to set the local Item in the local storage

    setLocalItem(name, value) {
        localStorage.setItem(name, value);
    }


   /**
    *
    * @method: get
    *
    * @purpose: to fetch data from an api using a get request and return the data no callback
    *
    */

   async get(url, headers) {

               let request = new Request(url, {
                   method: 'GET',
                   headers: headers
               });

               return fetch(request)
                   .then(response => {
                       return new Promise((resolve, reject) => {
                           response.json().then(data => {
                               resolve(data);
                           });
                       });
                   })
                   .catch(error => {
                       console.log(error);
                   });

       }

   /**
    *
    *  @method: post
    *
    *  @purpose: to fetch data from an api using a post request and return the data no callback
    *
    */

   async post(url, data, headers) {
       let request = new Request(url, {
           method: 'POST',
           body: JSON.stringify(data),
           headers: headers
       });

       return fetch(request)
           .then(response => {
               return new Promise((resolve, reject) => {
                   response.json().then(data => {
                       resolve(data);
                   });
               });
           }).catch(error => {
               console.log(error);
           });
   }

   /**
    *
    *  @method: upload
    *
    *  @purpose: to upload a file to an api using a post request
    *
    */

   async upload(url, data, headers) {
       let request = new Request(url, {
           method: 'POST',
           body: data,
           headers: headers
       });

       return fetch(request)
           .then(response => {
               return new Promise((resolve, reject) => {
                   response.json().then(data => {
                       resolve(data);
                   });
               });
           }).catch(error => {
               console.log(error);
           });
   }

   /**
    *
    *  @method patch
    *
    *
    *  @purpose: to preform a  update to the api using a patch request
    *
    */
   async patch(url, data, headers) {

       let request = new Request(url, {
           method: 'PATCH',
           body: JSON.stringify(data),
           headers: headers
       });

       return fetch(request)
           .then(response => {
               return new Promise((resolve, reject) => {
                   response.json().then(data => {
                       resolve(data);
                   });
               });
           }).catch(error => {
               console.log(error);
           });
   }


   /*
       @method: put
       @purpose: to update data in an api using a put request
   */

   async put(url, data, headers) {

           let request = new Request(url, {
               method: 'PUT',
               body: JSON.stringify(data),
               headers: headers
           });

           return fetch(request)
               .then(response => {
                   return new Promise((resolve, reject) => {
                       response.json().then(data => {
                           resolve(data);
                       });
                   });
               }).catch(error => {
                   console.log(error);
               });
   }


   /**
    *
    *  @method: delete
    *
    *  @purpose inorder to delete data from an api using a delete request
    */
   async delete(url, headers) {

           let request = new Request(url, {
               method: 'DELETE',
               headers: headers
           });

           return fetch(request)
               .then(response => {
                   return new Promise((resolve, reject) => {
                       response.json().then(data => {
                           resolve(data);
                       });
                   });
               }).catch(error => {
                   console.log(error);
               });
   }
}