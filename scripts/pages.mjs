// Routes and search descriptions stay together so navigation and metadata agree.
export const pages = [
  { id: 'home', path: '', label: 'Home', template: 'home.html' },
  { id: 'cfp', path: 'cfp/', label: 'Call for Papers', template: 'cfp.html',
    description: 'Topics and draft submission guidelines for Retrieval Beyond Documents at NAACL 2027, including paper preparation, review routes, and publication options.' },
  { id: 'speakers', path: 'speakers/', label: 'Speakers', template: 'speakers.html',
    description: 'Meet the invited speakers at RBD, the Retrieval Beyond Documents workshop at NAACL 2027: Iryna Gurevych, Graham Neubig, Scott Wen-tau Yih, and Jimmy Lin.' },
  { id: 'program', path: 'program/', label: 'Program', template: 'program.html',
    description: 'Planned talks, contributed presentations, and panel at the RBD workshop at NAACL 2027. The final schedule and workshop day will be announced.' },
  { id: 'organizers', path: 'organizers/', label: 'Organizers', template: 'organizers.html',
    description: 'Meet the organizers and program committee of Retrieval Beyond Documents, the NAACL 2027 workshop on capability retrieval for language agents.' }
];
export function legacyRoutes(data) {
  return Object.fromEntries([
    ['cfp', 'cfp/'], ['cfp-title', 'cfp/'],
    ['guidelines', 'cfp/#guidelines'], ['submission-guidelines', 'cfp/#submission-guidelines'],
    ['speakers', 'speakers/'], ['speakers-title', 'speakers/'],
    ['program', 'program/'], ['program-title', 'program/'],
    ['organizers', 'organizers/'], ['organizers-title', 'organizers/'],
    ['committee', 'organizers/#committee'], ['committee-title', 'organizers/#committee'],
    ...data.speakers.map(person => [person.id, `speakers/#${person.id}`]),
    ...data.organizers.map(person => [person.id, `organizers/#${person.id}`])
  ]);
}
