'use strict';

var s = JSON.stringify;

describe("important-files", function() {
  var mfiles = require("../lib/important-files.js");

  function commit(adds, mods) {
    return {
      "added": adds,
      "author":{
        "email":"lolwut@noway.biz",
        "name":"Garen Torikian",
        "username":"octokitty"
      },
      "committer":{
        "email":"lolwut@noway.biz",
        "name":"Garen Torikian",
        "username":"octokitty"
      },
      "distinct":true,
      "id":"c441029cf673f84c8b7db52d0a5944ee5c52ff89",
      "message":"Test",
      "modified": mods,
      "removed":[

      ],
      "timestamp":"2013-02-22T13:50:07-08:00",
      "url":"https://github.com/octokitty/testing/commit/c441029cf673f84c8b7db52d0a5944ee5c52ff89"
    };
  }

  function postReceive(commits) {
    return {
      "after": "1481a2de7b2a7d02428ad93446ab166be7793fbb",
      "before": "17c497ccc7cca9c2f735aa07e9e3813060ce9a6a",
      "commits": commits,
      "compare":"https://github.com/octokitty/testing/compare/17c497ccc7cc...1481a2de7b2a",
      "created":false,
      "deleted":false,
      "forced":false,
      "head_commit":{
        "added":[
          "words/madame-bovary.txt"
        ],
        "author":{
          "email":"lolwut@noway.biz",
          "name":"Garen Torikian",
          "username":"octokitty"
        },
        "committer":{
          "email":"lolwut@noway.biz",
          "name":"Garen Torikian",
          "username":"octokitty"
        },
        "distinct":true,
        "id":"1481a2de7b2a7d02428ad93446ab166be7793fbb",
        "message":"Rename madame-bovary.txt to words/madame-bovary.txt",
        "modified":[

        ],
        "removed":[
          "madame-bovary.txt"
        ],
        "timestamp":"2013-03-12T08:14:29-07:00",
        "url":"https://github.com/octokitty/testing/commit/1481a2de7b2a7d02428ad93446ab166be7793fbb"
      },
      "pusher":{
        "name":"none"
      },
      "ref":"refs/heads/master",
      "repository":{
        "created_at":1332977768,
        "description":"",
        "fork":false,
        "forks":0,
        "has_downloads":true,
        "has_issues":true,
        "has_wiki":true,
        "homepage":"",
        "id":3860742,
        "language":"Ruby",
        "master_branch":"master",
        "name":"testing",
        "open_issues":2,
        "owner":{
          "email":"lolwut@noway.biz",
          "name":"octokitty"
        },
        "private":false,
        "pushed_at":1363295520,
        "size":2156,
        "stargazers":1,
        "url":"https://github.com/octokitty/testing",
        "watchers":1
      }
    }
  }

  var badInput0 = undefined;
  var badInput1 = {};
  var no_commits = postReceive([])
  var three_commits_one_per = postReceive([
      commit(['README.md'], []), 
      commit([], ['derp.js']), 
      commit(['lerp.txt'], []) 
  ]);
  var one_commit_three_per = postReceive([
      commit([], ['README.md', 'derp.js', 'lerp.txt'])
  ]);
  var three_commits_three_per = postReceive([
      commit(['README.md', 'derp.js'], ['lerp.txt']),
      commit(['a.js', 'b.js', 'c.js'], []),
      commit(['a.txt', 'b.txt', 'c.txt'], [])
  ]);
  var three_commits_with_dups = postReceive([
      commit(['README.md'], ['a.js']),
      commit([], ['README.md', 'derp.js', 'lerp.txt']),
      commit([], ['a.js', 'b.js', 'README.md'])
  ]);
  // even though this shouldn't happen
  var one_commit_with_dups = postReceive([
      commit(['README.md', 'a.js', 'README.md'], [])
  ]);

  it("should not die on bad input", function() {
    expect(s(mfiles(badInput0))).toBe(s([]));
    expect(s(mfiles(badInput1))).toBe(s([]));
  });

  it("should return nothing on no commits", function() {
    expect(s(mfiles(no_commits))).toBe(s([]));
  });

  it("should flatten modified and added arrays", function() {
    expect(s(mfiles(three_commits_one_per)))
        .toBe(s(['README.md', 'derp.js', 'lerp.txt']));
    expect(s(mfiles(one_commit_three_per)))
        .toBe(s(['README.md', 'derp.js', 'lerp.txt']));
    expect(s(mfiles(three_commits_three_per)))
        .toBe(s(['README.md', 'derp.js', 'lerp.txt',
                 'a.js', 'b.js', 'c.js',
                 'a.txt', 'b.txt', 'c.txt']));
  });

  it("should ignore duplicates", function() {
    expect(s(mfiles(three_commits_with_dups)))
        .toBe(s(['README.md', 'a.js', 'derp.js', 'lerp.txt', 'b.js']));
    expect(s(mfiles(one_commit_with_dups)))
        .toBe(s(['README.md', 'a.js']));
  });

});
