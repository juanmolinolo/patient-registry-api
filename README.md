# patient-registry-api

## Project Overview

This project is a full-stack application built using Laravel and React with TailwindCSS and Inertia.js. The main objective of this application is to create a Patient Registry system, where users can add and view patient information.

### Technologies Used

- **Laravel**: A PHP framework for building robust and scalable backend applications.
- **React**: A JavaScript library for building dynamic and interactive user interfaces.
- **TailwindCSS**: A utility-first CSS framework for rapidly building custom user interfaces.
- **Inertia.js**: A framework for creating single-page applications using classic server-side routing and controllers.

## Build Steps

To get the project up and running locally using Docker with Laravel Sail, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/.../patient-registry-api.git
    cd patient-registry
    ```

2. **Install Sail dependencies**:
    ```bash
    composer install
    ```

3. **Set up environment variables**:
    Copy the `.env.example` file to `.env` and configure the necessary environment variables, including the database connection settings.
    ```bash
    cp .env.example .env
    ```

4. **Generate application key**:
    ```bash
    ./vendor/bin/sail artisan key:generate
    ```

5. **Start the Docker containers**:
    ```bash
    ./vendor/bin/sail up -d
    ```

6. **Run database migrations and seeders**:
    ```bash
    ./vendor/bin/sail artisan migrate --seed
    ```

7. **Create a symbolic link for storage**:
    ```bash
    ./vendor/bin/sail artisan storage:link
    ```

8. **Install frontend dependencies**:
    ```bash
    ./vendor/bin/sail npm install
    ```

9. **Build frontend assets**:
    ```bash
    ./vendor/bin/sail npm run dev
    ```

10. **Start the worker for email jobs**:
    ```bash
    ./vendor/bin/sail artisan queue:work
    ```

The application should now be running at `http://localhost`.

## Complications Encountered

During the development of this project, a few complications were encountered:

- **Laravel's Symlink for Storage**: Despite following the [Laravel docs instructions on setting up a public disk](https://laravel.com/docs/11.x/filesystem#the-public-disk), I was not able to get it done. I'm still not sure the reason behind it. For this reason, despite being able to store new patient images, I was not able to access them and display them on the frontend. React currently displays a stock image for all patients.
- **View Cache Issues**: Changes to the views were not reflecting immediately due to Laravel's view caching. This was resolved by running `php artisan view:clear` to clear the cached views whenever changes were made.
- **CSRF Token Issues**: All POST operations were initially blocked by the need for a CSRF token. This was resolved by setting up a specific `api.php` file for endpoints, that is ingored by the CSRF middleware by default.
- **Weird .env behaviour**: For some reason, when specifying the `DB_HOST=` value on the `.env` file, I could only run artisan database commands as long as the value was my local IP: `DB_HOST=127.0.0.1`, despite Sails'the value being set as `DB_HOST=mysql` by default.

## Conclusion

Thank you for giving me the opportunity to work on this coding challenge. It was certainly a challenge, given my lack of previous knowledge on Laravel + React, coming from a .NET + Angular background. It was a valuable experience that allowed me to demonstrate new skills in Laravel, React, TailwindCSS, and Inertia.js.

---

Feel free to reach out if you have any questions or need further clarification on any part of the project.

Best regards.