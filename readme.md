Gos-bPlus
=========

Integration for goshawkdb and a b-plus tree.

Use the test environment.

Check the visualizer: https://rawgit.com/goshawkdb/visualizer/master/index.html

Install into an existing module with `npm install --save kybernetikos/gos-bplus` or check it out and
`npm install` from inside.

Run the example with `node example.js` inside gos-bplus.

```
 const {getApi} = require('gos-bplus')

 /* ... */

 connection.transact((txn) => {
		const testRootRef = txn.root('test')

		// Do this if you need to initialise:
		txn.write(testRootRef, Buffer.from('{"rootRef": true}'), [])
		const tree = new BPlus(testRootRef, getApi(txn))

		tree.set("adam", "brilliant")
		tree.set("sam", "superb")
		tree.set("hello", "there")
		tree.set("good", "hurrah")
		tree.set("tasty", "bob")
		tree.set("jim", "captain")
		tree.set("crystals", "take it")
		console.log(Array.from(tree))
	}).then(
		() => {
			console.log('transaction committed')
			connection.close()
		}, (e) => {
			console.log('transaction failed because', e)
			connection.close()
		}
	)
```
