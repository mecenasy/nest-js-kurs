const fs = require('fs');

const roles = ['admin', 'teacher', 'student', 'user'];
const groups = ['IPA', 'IPB', 'ISA', 'ISB', 'ISC', 'ZMA', 'ZMB', 'ZKA', 'ZKB', 'ZKC'];
const specialties = ['Programowanie', 'Sieciowe', 'Marketing', 'Księgowość'];
const years = ['1', '2', '3', '4'];
const directions = ['Informatyka', 'Zarządzanie'];

const names = ['Jan', 'Anna', 'Piotr', 'Maria', 'Krzysztof', 'Katarzyna', 'Marek', 'Magdalena', 'Tomasz', 'Agnieszka'];
const surnames = ['Nowak', 'Kowalski', 'Wiśniewski', 'Wójcik', 'Kowalczyk', 'Kamiński', 'Lewandowski', 'Zieliński'];
const cities = ['Warszawa', 'Kraków', 'Wrocław', 'Poznań', 'Gdańsk', 'Łódź', 'Szczecin'];

const generateUsers = (count) => {
  const users = [];

  for (let i = 0; i < count; i++) {
    const role = roles[Math.floor(Math.random() * roles.length)];
    const name = names[Math.floor(Math.random() * names.length)];
    const surname = surnames[Math.floor(Math.random() * surnames.length)];

    const user = {
      email: `${name.toLowerCase()}.${surname.toLowerCase()}${i}@example.com`,
      password: `Pass${Math.floor(Math.random() * 900 + 100)}#`,
      role: role,
      person: {
        name: name,
        surname: surname,
        phone: 500000000 + i,
        photo: `photo_${i}.jpg`,
      },
      address: {
        street: 'Ulica ' + (Math.floor(Math.random() * 100) + 1),
        city: cities[Math.floor(Math.random() * cities.length)],
        country: 'Polska',
        number: `${Math.floor(Math.random() * 200)}`,
        zipCode: `${Math.floor(Math.random() * 89 + 10)}-${Math.floor(Math.random() * 899 + 100)}`,
      },
    };

    // Dodaj sekcję student tylko jeśli rola to 'student'
    if (role === 'student') {
      user.student = {
        direction: directions[Math.floor(Math.random() * directions.length)],
        group: groups[Math.floor(Math.random() * groups.length)],
        year: years[Math.floor(Math.random() * years.length)],
        specialty: specialties[Math.floor(Math.random() * specialties.length)],
      };
    }

    users.push(user);
  }
  return users;
};

const users = generateUsers(500);
console.log(`Wygenerowano ${users.length} użytkowników.`);
console.log(users[0]);

fs.writeFileSync('users.json', JSON.stringify(users, null, 2));