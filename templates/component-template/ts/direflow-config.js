module.exports = {
  direflowMetadata: {
    title: '%name-snake%',
    description: '%description%',
    type: '%setup-type%',
    createVersion: '%install-version%',
  },
  plugins: [
    {
      name: 'font-loader',
      options: {
        google: {
          families: ['Advent Pro', 'Noto Sans JP'],
        },
      },
    },
  ],
};
